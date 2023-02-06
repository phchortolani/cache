import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import java.net.InetAddress;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import java.text.DecimalFormat;

import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;


/**
 * Responsible for dealing with HTTP requests in order to generate Jasper PDF Reports
 *
 * Historico:
 *
 * 2009-May-08 Pablo  Closing connection and general refactoring
 * 2008-Jun-18 Soeiro Added a start-up message
 * 2008-Mar-17 Soeiro Adequacao do codigo aos padroes Java: variaveis em minusculo, etc.
 * 2008-Fev-22 Soeiro Alteracoes para limpar codigo desnecessario, mostrar dados dos
 *                    relatorios, parametros, SQL, erros
 * AAAA-MMM-DD Rubens Criacao
 */
public class JasperReportServlet extends HttpServlet
{
	// For serializing identification
	public static final long serialVersionUID = -1;

	private static final String CONFIG_FILE = "alphalinc.properties";
	private static final String CACHE_DRIVER = "com.intersys.jdbc.CacheDriver";

	// Debug: 0=No debug; 1=Print parameters; 2=Print parameters and SQL query
	private int debugLevel;
	private String reportName;
	private DecimalFormat formatter;

	public JasperReportServlet()
	{
		debugLevel = 0;
		reportName = null;
		formatter = new DecimalFormat("0.00");
	}

	public void init(ServletConfig config) throws ServletException
	{
		super.init(config);

		System.out.println("===============================================================================");
		System.out.println((new Date()) + " Alphalinc JasperReportServlet initialized.");
		System.out.println("===============================================================================");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws ServletException
	{
		String debugParameter;
		long partialClock, totalClock;
		String reportFolder, connectionUrl, currentUser;
		Map<String,Object> parameters;
		Enumeration<?> names;
		String name;
		JasperDesign jasperDesign;
		JasperReport jasperReport;
		StringBuffer stats;
		Connection jdbcConnection;
		byte[] bytesArquivo;
		ServletOutputStream ouputStream;

		totalClock = System.currentTimeMillis();
		partialClock = totalClock;
		stats = new StringBuffer();
		jdbcConnection = null;

		try
		{
			// Define debug level
			debugParameter = request.getParameter("debugMode");
			if ((debugParameter != null) &&
				 (debugParameter.equals("1") || debugParameter.equals("2")))
				debugLevel = Integer.parseInt(debugParameter);

			reportName = request.getParameter("reportName");
			reportFolder = request.getParameter("folder");
			connectionUrl = request.getParameter("connection");
			currentUser = request.getParameter("user");
			parameters = new HashMap<String,Object>();

			// Log initial information
			System.out.println("--> Begin " + logDetailedRequestInfo(request, debugLevel > 0));

			// Save report name in report parameters for later use (Soeiro)
			parameters.put("reportName", reportName);

			// Set locale to pt_BR
			parameters.put("REPORT_LOCALE", new Locale("pt", "BR"));

			try
			{
				// IP where Jasper is installed
				parameters.put("ip", InetAddress.getLocalHost().getHostAddress());
			}
			catch (Exception e)
			{
			}

			// Put all request parameters as report parameters for later use
			names = request.getParameterNames();
			while (names.hasMoreElements())
			{
				name = (String) names.nextElement();

				if (name != null)
					parameters.put(name, request.getParameter(name));
			}

			// Load and compile report
			jasperDesign = JRXmlLoader.load(reportFolder + reportName + ".jrxml");
			jasperReport = JasperCompileManager.compileReport(jasperDesign);
			stats.append(" compile: " + getElapsedTime(partialClock));
			partialClock = System.currentTimeMillis();

			// Log SQL query
			if (debugLevel == 2)
				System.out.println(jasperReport.getQuery().getText());

			// Fill report with data
			jdbcConnection = connectDB(connectionUrl);
			JasperFillManager.fillReportToFile(jasperReport, reportFolder + "Compiled/" + currentUser +
				".jrprint", parameters, jdbcConnection);
			stats.append(" sql: " + getElapsedTime(partialClock));
			partialClock = System.currentTimeMillis();

			// Export report to PDF
			JasperExportManager.exportReportToPdfFile(reportFolder + "Compiled/" + currentUser +
				".jrprint", reportFolder + "Compiled/" + currentUser + ".pdf");

			// Place PDF in the HTTP response
			bytesArquivo = fileToByte(new File(reportFolder + "Compiled/" + currentUser + ".pdf"));
			response.setContentType("application/pdf");
			response.setContentLength(bytesArquivo.length);
			ouputStream = response.getOutputStream();
			ouputStream.write(bytesArquivo, 0, bytesArquivo.length);
			ouputStream.flush();
			ouputStream.close();
			stats.append(" pdf: " + getElapsedTime(partialClock));
		}
		catch (JRException e)
		{
			System.out.println("Erro (relatorio): " + e.getMessage());
			System.out.println("Request que causou o erro:");
			System.out.println(logDetailedRequestInfo(request, true));
			e.printStackTrace();
		}
		catch (IOException e)
		{
			System.out.println("Erro (arquivo): " + e.getMessage());
			System.out.println("Request que causou o erro:");
			System.out.println(logDetailedRequestInfo(request, true));
			e.printStackTrace();
		}
		finally
		{
			if (jdbcConnection != null)
			{
				try
				{
					jdbcConnection.rollback();
					jdbcConnection.close();
					System.out.println("--> Connection released");
				}
				catch (Exception e)
				{
				}
			}

			// Some additional info
			System.out.println("--> End " + logRequestInfo(request) +
				// Total time
				"Total: " + getElapsedTime(totalClock) + stats.toString());
		}
	}

	/**
	 * Returns basic information
	 *
	 * 2008-Fev-22 Soeiro created
	 */
	private String logDetailedRequestInfo(HttpServletRequest request, boolean includeParameters)
	{
		StringBuffer sb;
		String dateTime;
		Enumeration<?> names;
		String name;

		sb = new StringBuffer();

		// Report name, operating user, ip, ...
		sb.append(logRequestInfo(request));

		// Date / time
		dateTime = request.getParameter("dateTime");
		if (dateTime == null)
			dateTime = (new Date()).toString();
		sb.append(dateTime + " -> ");

		// Include all request parameters
		if (includeParameters)
		{
			names = request.getParameterNames();
			while (names.hasMoreElements())
			{
				name = (String) names.nextElement();
				if (name != null)
				{
					sb.append("[" + name + "=");
					sb.append(request.getParameter(name));
					sb.append("]");
				}
			}
		}

		return sb.toString();
	}

	/**
	 * Returns just a header: report name, operating user and ip (maybe more)
	 */
	private String logRequestInfo(HttpServletRequest request)
	{
		StringBuffer sb;
		String operatingUser;

		sb = new StringBuffer();

		// Report name
		if (reportName != null)
			sb.append(reportName + " ");
		else
			sb.append("unkown report ");

		// Operating user and ip
		operatingUser = request.getParameter("operatingUser");
		if (operatingUser == null)
			operatingUser = "unkown user";
		sb.append("[" + operatingUser + " - " + request.getRemoteAddr() + "] ");

		return sb.toString();
	}

	/**
	 * Connects to the database using the specified URL
	 */
	private Connection connectDB(String connectionUrl)
	{
		Properties properties;
		String username, password;

		try
		{
			properties = new Properties();
			properties.load(getClass().getResourceAsStream(CONFIG_FILE));
			username = (String) properties.get("username");
			password = (String) properties.get("password");

			Class.forName(CACHE_DRIVER);

			return DriverManager.getConnection(connectionUrl, username, password);
		}
		catch (IOException e)
		{
			System.out.println("Error while trying to read config file: " + e.getMessage());
		}
		catch (ClassNotFoundException e)
		{
			System.out.println("Database driver not found: " + e.getMessage());
		}
		catch (SQLException e)
		{
			System.out.println("Could not connect to the database: " + e.getMessage());
		}

		return null;
	}

	/**
	 * Converts a file object to a byte array
	 */
	private byte[] fileToByte(File file) throws IOException
	{
		FileInputStream fis;
		ByteArrayOutputStream baos;
		byte[] buffer;
		int bytesRead;

		fis = new FileInputStream(file);
		baos = new ByteArrayOutputStream();
		buffer = new byte[8192];
		bytesRead = 0;

		while ((bytesRead = fis.read(buffer, 0, 8192)) != -1)
			baos.write(buffer, 0, bytesRead);

		return baos.toByteArray();
	}

	/**
	 * Calculates the elapsed time, rounds to 2 decimal places and returns as a
	 * String. Example: 0.12s
	 */
	private String getElapsedTime(long startTime)
	{
		double result;

		result = ((double) (System.currentTimeMillis() - startTime)) / 1000.0;

		return formatter.format(result) + "s";
	}
}
