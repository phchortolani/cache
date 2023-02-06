import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.sql.SQLException;
import java.sql.DriverManager;
import java.util.Properties;
import javax.servlet.ServletOutputStream;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.design.JasperDesign;
import java.util.Enumeration;
import java.sql.Connection;
import java.io.IOException;
import net.sf.jasperreports.engine.JRException;
import java.io.File;
import net.sf.jasperreports.engine.JasperExportManager;
import java.util.Map;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import java.net.InetAddress;
import java.util.Locale;
import java.util.HashMap;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletException;
import java.util.Date;
import javax.servlet.ServletConfig;
import java.text.DecimalFormat;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

// 
// Decompiled by Procyon v0.5.36
// 

@WebServlet({ "/JasperReportServlet" })
public class JasperReportServlet extends HttpServlet
{
    public static final long serialVersionUID = -1L;
    private static final String CONFIG_FILE = "alphalinc.properties";
    private static final String IRIS_DRIVER = "com.intersystems.jdbc.IRISDriver";
    private int debugLevel;
    private String reportName;
    private DecimalFormat formatter;
    
    public JasperReportServlet() {
        this.debugLevel = 0;
        this.reportName = null;
        this.formatter = new DecimalFormat("0.00");
    }
    
    public void init(final ServletConfig paramServletConfig) throws ServletException {
        super.init(paramServletConfig);
        System.out.println("===============================================================================");
        System.out.println(new Date() + " Alphalinc JasperReportServlet initialized.");
        System.out.println("===============================================================================");
    }
    
    public void doGet(final HttpServletRequest paramHttpServletRequest, final HttpServletResponse paramHttpServletResponse) throws ServletException {
        long l3;
        final long l2 = l3 = System.currentTimeMillis();
        final StringBuffer localStringBuffer = new StringBuffer();
        Connection localConnection = null;
        try {
            final String str1 = paramHttpServletRequest.getParameter("debugMode");
            if (str1 != null && (str1.equals("1") || str1.equals("2"))) {
                this.debugLevel = Integer.parseInt(str1);
            }
            this.reportName = paramHttpServletRequest.getParameter("reportName");
            final String str2 = paramHttpServletRequest.getParameter("folder");
            final String str3 = paramHttpServletRequest.getParameter("connection");
            final String str4 = paramHttpServletRequest.getParameter("user");
            final HashMap localHashMap = new HashMap();
            System.out.println("--> Begin " + this.logDetailedRequestInfo(paramHttpServletRequest, this.debugLevel > 0));
            localHashMap.put("reportName", this.reportName);
            localHashMap.put("REPORT_LOCALE", new Locale("pt", "BR"));
            try {
                localHashMap.put("ip", InetAddress.getLocalHost().getHostAddress());
            }
            catch (Exception ex) {}
            final Enumeration localEnumeration = paramHttpServletRequest.getParameterNames();
            while (localEnumeration.hasMoreElements()) {
                final String str5 = localEnumeration.nextElement();
                if (str5 != null) {
                    localHashMap.put(str5, paramHttpServletRequest.getParameter(str5));
                }
            }
            final JasperDesign localJasperDesign = JRXmlLoader.load(String.valueOf(str2) + this.reportName + ".jrxml");
            final JasperReport localJasperReport = JasperCompileManager.compileReport(localJasperDesign);
            localStringBuffer.append(" compile: " + this.getElapsedTime(l3));
            l3 = System.currentTimeMillis();
            if (this.debugLevel == 2) {
                System.out.println(localJasperReport.getQuery().getText());
            }
            localConnection = this.connectDB(str3);
            JasperFillManager.fillReportToFile(localJasperReport, String.valueOf(str2) + "Compiled/" + str4 + ".jrprint", (Map)localHashMap, localConnection);
            localStringBuffer.append(" sql: " + this.getElapsedTime(l3));
            l3 = System.currentTimeMillis();
            JasperExportManager.exportReportToPdfFile(String.valueOf(str2) + "Compiled/" + str4 + ".jrprint", String.valueOf(str2) + "Compiled/" + str4 + ".pdf");
            final byte[] arrayOfByte = this.fileToByte(new File(String.valueOf(str2) + "Compiled/" + str4 + ".pdf"));
            paramHttpServletResponse.setContentType("application/pdf");
            paramHttpServletResponse.setContentLength(arrayOfByte.length);
            final ServletOutputStream localServletOutputStream = paramHttpServletResponse.getOutputStream();
            localServletOutputStream.write(arrayOfByte, 0, arrayOfByte.length);
            localServletOutputStream.flush();
            localServletOutputStream.close();
            localStringBuffer.append(" pdf: " + this.getElapsedTime(l3));
        }
        catch (JRException localJRException) {
            System.out.println("Erro (relatorio): " + localJRException.getMessage());
            System.out.println("Request que causou o erro:");
            System.out.println(this.logDetailedRequestInfo(paramHttpServletRequest, true));
            localJRException.printStackTrace();
        }
        catch (IOException localIOException) {
            System.out.println("Erro (arquivo): " + localIOException.getMessage());
            System.out.println("Request que causou o erro:");
            System.out.println(this.logDetailedRequestInfo(paramHttpServletRequest, true));
            localIOException.printStackTrace();
        }
        finally {
            if (localConnection != null) {
                try {
                    localConnection.rollback();
                    localConnection.close();
                    System.out.println("--> Connection released");
                }
                catch (Exception ex2) {}
            }
            System.out.println("--> End " + this.logRequestInfo(paramHttpServletRequest) + "Total: " + this.getElapsedTime(l2) + localStringBuffer.toString());
        }
        if (localConnection != null) {
            try {
                localConnection.rollback();
                localConnection.close();
                System.out.println("--> Connection released");
            }
            catch (Exception ex3) {}
        }
        System.out.println("--> End " + this.logRequestInfo(paramHttpServletRequest) + "Total: " + this.getElapsedTime(l2) + localStringBuffer.toString());
    }
    
    private String logDetailedRequestInfo(final HttpServletRequest paramHttpServletRequest, final boolean paramBoolean) {
        final StringBuffer localStringBuffer = new StringBuffer();
        localStringBuffer.append(this.logRequestInfo(paramHttpServletRequest));
        String str1 = paramHttpServletRequest.getParameter("dateTime");
        if (str1 == null) {
            str1 = new Date().toString();
        }
        localStringBuffer.append(String.valueOf(str1) + " -> ");
        if (paramBoolean) {
            final Enumeration localEnumeration = paramHttpServletRequest.getParameterNames();
            while (localEnumeration.hasMoreElements()) {
                final String str2 = localEnumeration.nextElement();
                if (str2 != null) {
                    localStringBuffer.append("[" + str2 + "=");
                    localStringBuffer.append(paramHttpServletRequest.getParameter(str2));
                    localStringBuffer.append("]");
                }
            }
        }
        return localStringBuffer.toString();
    }
    
    private String logRequestInfo(final HttpServletRequest paramHttpServletRequest) {
        final StringBuffer localStringBuffer = new StringBuffer();
        if (this.reportName != null) {
            localStringBuffer.append(String.valueOf(this.reportName) + " ");
        }
        else {
            localStringBuffer.append("unkown report ");
        }
        String str = paramHttpServletRequest.getParameter("operatingUser");
        if (str == null) {
            str = "unkown user";
        }
        localStringBuffer.append("[" + str + " - " + paramHttpServletRequest.getRemoteAddr() + "] ");
        return localStringBuffer.toString();
    }
    
    private Connection connectDB(final String paramString) {
        try {
            final Properties localProperties = new Properties();
            localProperties.load(this.getClass().getResourceAsStream("alphalinc.properties"));
            final String str1 = (String)localProperties.get("username");
            final String str2 = (String)localProperties.get("password");
            Class.forName("com.intersystems.jdbc.IRISDriver");
            return DriverManager.getConnection(paramString, str1, str2);
        }
        catch (IOException localIOException) {
            System.out.println("Error while trying to read config file: " + localIOException.getMessage());
        }
        catch (ClassNotFoundException localClassNotFoundException) {
            System.out.println("Database driver not found: " + localClassNotFoundException.getMessage());
        }
        catch (SQLException localSQLException) {
            System.out.println("Could not connect to the database: " + localSQLException.getMessage());
        }
        return null;
    }
    
    private byte[] fileToByte(final File paramFile) throws IOException {
        final FileInputStream localFileInputStream = new FileInputStream(paramFile);
        final ByteArrayOutputStream localByteArrayOutputStream = new ByteArrayOutputStream();
        final byte[] arrayOfByte = new byte[8192];
        int i = 0;
        while ((i = localFileInputStream.read(arrayOfByte, 0, 8192)) != -1) {
            localByteArrayOutputStream.write(arrayOfByte, 0, i);
        }
        return localByteArrayOutputStream.toByteArray();
    }
    
    private String getElapsedTime(final long paramLong) {
        final double d = (System.currentTimeMillis() - paramLong) / 1000.0;
        return String.valueOf(this.formatter.format(d)) + "s";
    }
}
