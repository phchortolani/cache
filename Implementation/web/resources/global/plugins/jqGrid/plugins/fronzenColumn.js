(function ($, window, document, undefined) {

    /**
     * Descrição: 
     *  Adaptação para simular congelamento de colunas para o jqGrid com subgrid
     *  TODO: 
     *  -   Ajustar ordenamento de coluna pelo polo 
     *  -   
     */
    $.fronzenColumn = (function (options) {

        //var ini = Date.now();

        //Definição de options default, e parâmetros de configuração
        var jfc = {
            options: $.extend({
                columns: [],
                tableSelector: "",
                _idTable: ""
            }, options)
        };

        jfc.options._idTable = jfc.options.tableSelector.split("#")[1];

        //prepara medidas
        jfc = $.extend({
            _colModelParent: $(jfc.options.tableSelector).jqGrid("getGridParam", "colModel"),
            _heightHeaderParent: $("#gview_" + jfc.options._idTable + " .ui-jqgrid-hdiv").outerHeight() + 2,
            _heightBodyParent: $("#gview_" + jfc.options._idTable + " .ui-jqgrid-bdiv").outerHeight(),
            _heightSummaryParent: $("#gview_" + jfc.options._idTable + " .ui-jqgrid-sdiv").outerHeight(),
            _widthThSubGrid: $("th#" + jfc.options._idTable + "_subgrid").outerWidth(),
            _scrollBarWidth: 17
        }, jfc);

        jfc.options.columns.forEach(function (element) {
            jfc._widthThSubGrid += $("th#" + jfc.options._idTable + "_" + element).outerWidth();
        });

        jfc._heighTemplate = jfc._heightHeaderParent + jfc._heightBodyParent - jfc._scrollBarWidth + 1;
        jfc._heightFronzenTable = jfc._heighTemplate - jfc._heightHeaderParent - 1;
        jfc._fronzenTableId = "custom-frozen-" + jfc.options._idTable;

        //Cria div fixa com table para construção
        var template = "";
        template = template + "<div class='fronzen-template' style='background: white; top: -1px; width: " + jfc._widthThSubGrid + "px; height: " + jfc._heighTemplate + "px; position: absolute; z-index: 2;margin:-1px'> ";
        template = template + " <table id='" + jfc._fronzenTableId + "'></table> ";
        template = template + "</div>";


        //Reinicializa caso congelamento esteja ativo
        var activeTemplate = $(".fronzen-template");

        if (activeTemplate.attr("id") !== "") {
            activeTemplate.remove();
        }

        //Inclui div fixa na tabela
        $("#gbox_" + jfc.options._idTable + " #gview_" + jfc.options._idTable).append($(template));

        //Prepara obj do grid principal para evitar busca descnecessária varias vezes
        var gridObj = $(jfc.options.tableSelector);

        var optGrid = {
            data: gridObj.jqGrid("getRowData"),
            rowNum: gridObj.jqGrid("getGridParam", "rowNum"),
            colModel: gridObj.jqGrid("getGridParam", "colModel").filter(function (item) {
                return (($.inArray(item.name, jfc.options.columns) >= 0) || (item.key == true) || (item.subKey == true));
            }),
            rowattr: gridObj.jqGrid("getGridParam", "rowattr"),
            gridview: gridObj.jqGrid("getGridParam", "gridview"),
            loadonce: gridObj.jqGrid("getGridParam", "loadonce")
        };


        var $grid=$("#" + jfc._fronzenTableId).jqGrid({
            datatype: "local",
            data: optGrid.data,
            rowattr: optGrid.rowattr,
            gridview: optGrid.gridview,
            colModel: optGrid.colModel,
            loadonce: optGrid.loadonce,
            shrinkToFit: false,
            onSortCol: function (index, iCol, sortOrder) {
                //gridObj.jqGrid('sortGrid', index);
            },
            height: jfc._heightFronzenTable,
            rowNum: optGrid.rowNum,
            caption: '',
            viewrecords: true,
            /*onSelectRow: function (rowId) {
                gridObj.jqGrid("setSelection", rowId);
            },*/
            beforeSelectRow: function (rowid, e) {
                return false;
            },
            subGrid: true,
            subGridRowExpanded: function (parentRowID, parentRowKey) {
                /**
                 * TODO: Realizar a implementação de configurar o subgrid dinamicamente, para evitar a necessidade de 
                 * alterar o plugin
                 */
                var pSubGrid = parentRowID.split("-")[2];
                var subGridParentObj = $("#" + pSubGrid + "_table");

                var objParentRow = $(jfc.options.tableSelector).getRowData(parentRowKey);
                var codPolo = objParentRow.CodPolo;

                var childGridID = parentRowID + sulfixoGridBase;

                var produto = $("#CodProduto").val();
                var competencia = $("#CodCompetencia").val();

                // add a table and pager HTML elements to the parent grid row - we will render the child grid here
                $('#' + parentRowID).append('<table id=' + childGridID + '></table>');

                $("#" + childGridID).jqGrid({
                    url: urlBase,
                    loadBeforeSend: function (jqXHR) {

                        var produto = $("#CodProduto").select2("data")[0].id;
                        var competencia = $("#CodCompetencia").select2("data")[0].id;

                        jqXHR.setRequestHeader("CLASSMETHOD", 'GetBaseData');
                        jqXHR.setRequestHeader("COMPETENCIA", competencia);
                        jqXHR.setRequestHeader("CODPRODUTO", produto);
                        jqXHR.setRequestHeader("YBED", YBED);
                        jqXHR.setRequestHeader("YUSER", YUSER);
                        jqXHR.setRequestHeader("CODPOLO", codPolo);
                    },
                    mtype: "GET",
                    rowattr: function () {
                        return {
                            "class": "row-base"
                        };
                    },
                    datatype: "json",
                    page: 1,
                    cellEdit: 1,
                    colModel: [{
                            label: "Base",
                            name: "DescBase",
                            width: 280,
                            fronzen: true,
                            subKey: true
                        },
                        {
                            label: "Base",
                            name: "CodBase",
                            width: 0,
                            key: true,
                            hidden: true,
                            subKey: true
                        },
                        {
                            label: "Competência",
                            name: "Competencia",
                            width: 0,
                            hidden: true,
                            subKey: true
                        },
                        {
                            label: "Produto",
                            name: "CodProduto",
                            width: 0,
                            hidden: true,
                            subKey: true
                        },
                        {
                            label: "Polo",
                            name: "CodPolo",
                            width: 0,
                            hidden: true,
                            subKey: true
                        }
                    ],
                    loadonce: true,
                    /*onSelectRow: function (rowId) {
                        subGridParentObj.jqGrid("setSelection", rowId);
                    },*/
                    beforeSelectRow: function (rowid, e) {
                        return false;
                    },
                    shrinkToFit: false,
                    autowidth: true,
                    viewrecords: true,
                    height: 'auto',
                    gridComplete: function () {

                        /*subGridParentObj.bind("jqGridBeforeSelectRow", function (e, rowId, orgClickEvent) {
                            $("#" + childGridID).jqGrid("setSelection", rowId);
                        });*/

                        var idGrid = "#" + childGridID;
                        var ids = $(idGrid).getDataIDs();

                        $(idGrid).jqGrid('resetSelection');
                    }
                });

            }, // javascript function that will take care of showing the child grid
            subGridOptions: {
                reloadOnExpand: false,
                selectOnExpand: false,
                //expandOnLoad: true
            },
            resizeStop: function (newWidth, index) {},
            gridComplete: function (param) {

                /*$(jfc.options.tableSelector).bind("jqGridBeforeSelectRow", function (e, rowId, orgClickEvent) {
                    $("#" + jfc._fronzenTableId).jqGrid("setSelection", rowId);
                });*/

                //Tratamento para ordenação de colunas
                jfc.options.columns.forEach(function (element) {
                    $("#" + jfc._fronzenTableId + "_" + element).on("click", function () {
                        gridObj.jqGrid('sortGrid', element);
                    });

                    $("#jqgh_" + jfc._fronzenTableId + "_" + element).html(
                        $("#jqgh_" + jfc.options._idTable + "_" + element).html()
                    );
                });


                //Ajusta o width da tabela congelada
                $("#" + jfc._fronzenTableId).jqGrid('setGridWidth', jfc._widthThSubGrid + 2);

                //Ajusta Heigth do cabeçalho
                $(".ui-jqgrid-hbox [aria-labelledby='gbox_" + jfc._fronzenTableId + "'").css({
                    "height": jfc._heightHeaderParent
                });

                //Retira a borda para ajuste de layout
                $("#gbox_" + jfc._fronzenTableId).css({
                    "border": "0px solid transparent"
                });

                //Retira scroll
                $("#gview_" + jfc._fronzenTableId + " .ui-jqgrid-bdiv").css({
                    "overflow": "hidden"
                });

                //Sincronizar scroll no div congelado
                $("#gview_" + jfc.options._idTable + " .ui-jqgrid-bdiv").on("scroll", function () {
                    var scrolltbl=$(this).scrollTop();
                    var scrollFrz=$("#gview_" + jfc._fronzenTableId + " .ui-jqgrid-bdiv").scrollTop()
                    $("#gview_" + jfc._fronzenTableId + " .ui-jqgrid-bdiv").scrollTop(scrolltbl);
                });

                $("[aria-describedby='" + jfc._fronzenTableId + "_subgrid']").on("click", function (i) {
                    var idLinha = $(this).parent().prop("id");
                    gridObj.toggleSubGridRow(idLinha);
                });

                $.fronzenColumn.buttonExpandAll($("#" + jfc._fronzenTableId));
            }
        });
    });

    $.fronzenColumn.buttonExpandAll=(function(gridObj) {

        gridObj.jqGrid("navGrid", "#pager", {add: false, edit: false, del: false});

        var subGridOptions = gridObj.jqGrid("getGridParam", "subGridOptions"),
            plusIcon = subGridOptions.plusicon, 
            minusIcon = subGridOptions.minusicon,
            expandAllTitle = "Expandir todos os subgrids",
            collapseAllTitle = "Recolher todos os subgrids";
            
        $("#jqgh_" + gridObj[0].id + "_subgrid")
            .html('<a class="ui-sghref" style="cursor: pointer;"><span class="glyphicon ' + plusIcon + '" title="' + expandAllTitle + '"></span></a>')
            .click(function () {
                var $spanIcon = $(this).find(">a>span"),
                    $body = $(this).closest(".ui-jqgrid-view")
                        .find(">.ui-jqgrid-bdiv>div>.ui-jqgrid-btable>tbody");
                if ($spanIcon.hasClass(plusIcon)) {
                    $spanIcon.removeClass(plusIcon)
                        .addClass(minusIcon)
                        .attr("title", collapseAllTitle);
                    $body.find(">tr.jqgrow>td.sgcollapsed")
                        .click();
                } else {
                    $spanIcon.removeClass(minusIcon)
                        .addClass(plusIcon)
                        .attr("title", expandAllTitle);
                    $body.find(">tr.jqgrow>td.sgexpanded")
                        .click();
                }
        });
    });

    var getScrollBarWidth = (function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;

        if (w1 == w2) {
            w2 = outer.clientWidth;
        }

        document.body.removeChild(outer);

        return (w1 - w2);
    });



})(jQuery);