ECHO OFF

SET src_main_folder=D:\Projects\basic\main\Implementation\
SET src_des_folder=bkp-cleanbasic\

SET pastas=globals\nm\classes globals\nm\forms globals\nm\favorites src\cls src\inc src\mac
SET list=VARPedidoCompra VARCompra INAUF INReceipt INREC INRECReverse VARCompraEntregaPrevisao VARStock VAREstoqueConsEndereco VARStockHistory INMOV INADJATT INStockValCCAdj INWEINVP INWEINVD INWEINVK INWEINVE INReq INReqIssue INTFR VARINTFR INRECTFRSearch INIssue INIssueLoc INDispenseToPatient INIssueRev INADJ VARINADJ VARConsultaGerencialProduto VARAlerta VARPreAlertaLocal VARPreAlertaRede VARReposicao INART WWW101 VARTCIUnidadeMedida VARINDRPITEMTabela INItemGroup WWW0121C WWW0121 INLP INLIEF VARFornecedorOcorrencia INBrand VARCompareQrCodes MEDPatient WWWPWD WWW0131B WWW013 VARMensagemPainel VARMensagem VARWWWPRO VAREnvInfo VARTCISystemInformation VARTCILicenseUsageLog INVORG WWW012 VARBRModulo VARBRDiretorios VARBRTipoArqUpload VARDump VARParametroCliente VARHistoricoCompra VARHistoricoRecebimento VARHistoricoEstorno VAREstoquePosicao VARExpiryAlert VARRelDistribuicao VARHistoricoConsumo VARHistoricoDevolucoes VARHistoricoSaidas VARHistoricoConsumoDetalhe VAREntradaNotaFiscal VARMapaMovMensal VAREntradaDevolução VARLivroRegInventario VARSaidaRequisicao VARContabilTransferencia VARProdutoEtq VARConfigImpEtiqueta

	(for %%a in (%pastas%) do (
		(for %%b in (%list%) do (
			ECHO.
			ECHO Copiando arquivos %%b de %src_main_folder%%%a para %src_main_folder%%src_des_folder%%%a
			XCOPY %src_main_folder%%%a\*%%b*.* /i /f /y %src_main_folder%%src_des_folder%%%a
			DEL /Q %src_main_folder%%%a\*%%b*.*
		))
	))
	
PAUSE