export const AMBIENTEAPI = "prod"; // prod ou dev

export const NOME_SISTEMA = "ValidaSign";
export const VERSAO_SISTEMA = "v1.0";
export const SHOW_BREAKPOINT = false;

export const PATH_PDF_RECEITA =
    AMBIENTEAPI === "prod"
        ? `https://validasign.ampara.twsoft.com.br//wwwroot//pdfs//receitas//Receita-`
        : `D:\\TechnoWare\\Projetos\\CSharp\\Web\\FPGMWebAPI\\wwwroot\\pdfs\\receitas\\Receita-`;
