var reDigits = /^\d+$/;

function numInteiro(pStr)
{
	if (reDigits.test(pStr)) 
	{
		return true;
	} 
	else 
	if (pStr != null && pStr != "") 
	{
		return false;
	}
} 

var reDecimalPt = /^[+-]?((\d+|\d{1,3}(\.\d{3})+)(\,\d*)?|\,\d+)$/;
var reDecimalEn = /^[+-]?((\d+|\d{1,3}(\,\d{3})+)(\.\d*)?|\.\d+)$/;
var reDecimal = reDecimalPt;

function numReal(pStr)
{
	charDec = ",";
	if (reDecimal.test(pStr)) 
	{
		pos = pStr.indexOf(charDec);
		decs = pos == -1? 0: pStr.length - pos - 1;
		return true;
	} 
	else
	if (pStr != null && pStr != "") 
	{
		return false;
	}
} 

function validaCPF(cpf) 
{
		cpf = cpf.replace('.','');
		cpf = cpf.replace('.','');
		cpf = cpf.replace('-','');
		
		erro = new String;
		if (cpf.length < 11) erro += "Sao necessarios 11 digitos para verificacao do CPF! \n\n"; 
		var nonNumbers = /\D/;
		if (nonNumbers.test(cpf)) erro += "A verificacao de CPF suporta apenas numeros! \n\n";	
		if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999"){
			  erro += "Numero de CPF invalido!"
		}
		var a = [];
		var b = new Number;
		var c = 11;
		for (i=0; i<11; i++){
			a[i] = cpf.charAt(i);
			if (i <  9) b += (a[i] *  --c);
		}
		if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
		b = 0;
		c = 11;
		for (y=0; y<10; y++) b += (a[y] *  c--); 
		if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
		status = a[9] + ""+ a[10]
		if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10])){
			erro +="Digito verificador com problema!";
		}
		if (erro.length > 0){
			return false;
		}
		return true;
}

function verificaData(Data)
 {
  Data = Data.substring(0,10);
  
  var dma = -1;
  var data = Array(3);
  var ch = Data.charAt(0); 
  for(i=0; i < Data.length && (( ch >= '0' && ch <= '9' ) || ( ch == '/' && i != 0 ) ); ){
   data[++dma] = '';
   if(ch!='/' && i != 0) return false;
   if(i != 0 ) ch = Data.charAt(++i);
   if(ch=='0') ch = Data.charAt(++i);
   while( ch >= '0' && ch <= '9' ){
    data[dma] += ch;
    ch = Data.charAt(++i);
   } 
  }
  if(ch!='') return false;
  if(data[0] == '' || isNaN(data[0]) || parseInt(data[0]) < 1) return false;
  if(data[1] == '' || isNaN(data[1]) || parseInt(data[1]) < 1 || parseInt(data[1]) > 12) return false;
  if(data[2] == '' || isNaN(data[2]) || ((parseInt(data[2]) < 0 || parseInt(data[2]) > 99 ) && (parseInt(data[2]) < 1900 || parseInt(data[2]) > 9999))) return false;
  if(data[2] < 50) data[2] = parseInt(data[2]) + 2000;
  else if(data[2] < 100) data[2] = parseInt(data[2]) + 1900;
  switch(parseInt(data[1])){
   case 2: { if(((parseInt(data[2])%4!=0 || (parseInt(data[2])%100==0 && parseInt(data[2])%400!=0)) && parseInt(data[0]) > 28) || parseInt(data[0]) > 29 ) return false; break; }
   case 4: case 6: case 9: case 11: { if(parseInt(data[0]) > 30) return false; break;}
   default: { if(parseInt(data[0]) > 31) return false;}
  }
  return true; 
  
} 

function validar()
{
	var msg="";
	
	var tudo_ok=true;
	
	$("[obrigatorio=sim]").each(function(){
		
		msg="";		
		
		if( $(this).attr("type") == "radio"  )
		{
			
			if( $("input[name="+$(this).attr("name")+"]:checked").length == 0 )
			{				
				msg = "O campo " + $(this).attr("rotulo") + " é obrigatório";
			}
		}
		else
		if( $(this).attr("type") == "checkbox"  )
		{
			
			if( $("input[grupock="+$(this).attr("grupock")+"]:checked").length < $(this).attr("qde_min") )
			{				
				msg = "Pelo menos "+$(this).attr("qde_min")+" opção(ões) do campo(s) " + $(this).attr("rotulo") + " deve(m) ser marcado(s)!";
			}
		}
		else		
		if( $(this).val() == '' )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' é obrigatório !';		
		}
		else
		if( $(this).attr("tipo_dado") == "cpf" && !validaCPF($(this).val()) )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' deve ser válido !';		
		}		
		else
		if( $(this).attr("tipo_dado") == "data" && !verificaData($(this).val()) )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' deve ser uma data válida !';		
		}		
		else
		if( $(this).attr("tipo_dado") == "inteiro" && !numInteiro($(this).val()) )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' deve ser um numero inteiro válido !';		
		}		
		else
		if( $(this).attr("tipo_dado") == "real" && !numReal($(this).val()) )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' deve ser um numero real válido !';		
		}	
		else
		if( $(this).attr("tipo_dado") == "email" && !ValidaEmail($(this).val()) )
		{
			msg = 'O campo '+ $(this).attr("rotulo")+' deve ser um email válido !';		
		}	

		if( msg != '' )
		{
			tudo_ok = false;
		}


		if( $('#div_error_'+$(this).attr("name")) )
		{
			$('#div_error_'+$(this).attr("name")).html(msg);
		}

	}); 
	
	return tudo_ok;
	
} 