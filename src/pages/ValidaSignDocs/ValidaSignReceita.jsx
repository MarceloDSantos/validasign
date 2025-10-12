import React, { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Col,
    Form,
    Input,
    Row,
    Tooltip,
    Modal,
    Steps,
    QRCode,
    Space,
} from "antd";
import {
    PrinterOutlined,
    CloudDownloadOutlined,
    FileProtectOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    LinkOutlined,
    QrcodeOutlined,
    SignatureFilled,
} from "@ant-design/icons";
import {
    CustomValidations,
    validationMessages,
    validationType,
} from "../../helpers/CustomValidations";
import { isMobile } from "../../helpers/FuncoesExtras";
import api from "../../api";

import amparaLogo from "../../images/ampara-logo-transparente.png";
import {
    NOME_SISTEMA,
    PATH_PDF_RECEITA,
    URL_VALIDADOR_ITI,
    VERSAO_SISTEMA,
} from "../../helpers/Constants";

import "../Animacoes.css";
import "./ValidaSignReceita.css";

const ValidaSignReceita = ({ match }) => {
    // const { handleLogout } = useContext(Context);
    const [dispositivoMovel, setDispositivoMovel] = React.useState(isMobile());
    const [loading, setLoading] = useState(false);
    const [loadingBaixar, setLoadingBaixar] = useState(false);
    const [loadingImprimir, setLoadingImprimir] = useState(false);
    const [loadingURL, setLoadingURL] = useState(false);
    const [loadingQRCode, setLoadingQRCode] = useState(false);
    const [loadingValidaITI, setLoadingValidaITI] = useState(false);
    // const [alertMessage, setAlertMessage] = useState("");
    // const [alertType, setAlertType] = useState("error");
    const [acaoBotao, setAcaoBotao] = useState(0);
    const [valueToken, setValueToken] = useState("");
    const [alertMessageFalha, setAlertMessageFalha] = useState("");
    const [exibeModalValidacao, setExibeModalValidacao] = useState(false);
    const [exibeModalQrCode, setExibeModalQrCode] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState("");
    const [codAcessoQRCode, setCodAcessoQRCode] = useState("");

    const [form] = Form.useForm();
    const [pdfUrl, setPdfUrl] = useState("");

    let parametroToken = "";

    // Função para validar todos os dados no submit do form
    const onClickSubmit = () => {
        form.validateFields()
            .then(() => {
                setAlertMessageFalha("");
                form.submit();
            })
            .catch(() => {
                // setAlertType("error");
                // setAlertMessage("Falha na validação! Verifique os campos.");
            });
    };

    // Funcao disparada pelo form
    const onFinishForm = async (value) => {
        setAlertMessageFalha("");

        // Baixar
        if (acaoBotao === 1) {
            await downLoadReceitaPDF(value.token);
        } else if (acaoBotao === 2) {
            await imprimirReceitaPDF(value.token);
        } else if (acaoBotao === 3) {
            await copiarLinkArquivoPDF(value.token);
        } else if (acaoBotao === 4) {
            await exibirQRCodeReceitaPDF(value.token);
        } else if (acaoBotao === 5) {
            await redirecionaValidaITI();
        }
    };

    const redirecionaValidaITI = async () => {
        setAlertMessageFalha("");
        setLoadingValidaITI(true);

        const timer = setTimeout(() => {
            window.open(URL_VALIDADOR_ITI, "_blank");
        }, 2000); // 2000 milliseconds = 2 seconds

        return () => clearTimeout(timer);
    };

    // Busca FastReport MemoStream da Receita
    const exibirQRCodeReceitaPDF = async (token = "") => {
        setAlertMessageFalha("");
        setExibeModalQrCode(false);
        setLoadingQRCode(true);

        try {
            // Consome a API para realizar o login
            await api
                .get(`/farmacia/qrcode/receita/${token}`)
                // Se requisição com sucesso
                .then((response) => {
                    const { data } = response;
                    if (data.codResp === undefined) {
                        if (!data) {
                            setLoadingQRCode(false);
                            setAlertMessageFalha(
                                `Falha ao gerar QRCode /n [ ${err} ]`
                            );
                        } else {
                            setLoadingQRCode(false);

                            setQrCodeValue(data.url);
                            setCodAcessoQRCode(data.codAcesso);

                            setExibeModalQrCode(true);

                            return;
                        }
                    } else {
                        if (data.codResp < 0) {
                            setLoadingQRCode(false);
                            setAlertMessageFalha(data.msgResp);
                            return;
                        }
                    }
                });
        } catch (error) {
            setLoadingQRCode(false);
            // setAlertType("error");

            if (error.response && error.response?.data) {
                // Specify the encoding (e.g., 'utf-8', 'iso-8859-1')
                const decoder = new TextDecoder("utf-8");
                // Captura mensagem de erro
                const decodedString = decoder.decode(error.response.data);
                // Converte para JSON
                var resp = JSON.parse(decodedString);
                // Exibe Mensagem
                setAlertMessageFalha(resp);
            } else {
                setAlertMessageFalha("Falha " + error.message);
            }
        }
    };

    const copiarLinkArquivoPDF = async (token) => {
        setAlertMessageFalha("");
        setLoadingURL(true);

        try {
            // Consome a API para realizar o login
            await api
                .get(`/farmacia/url/receita/${token}`)
                // Se requisição com sucesso
                .then((response) => {
                    const { data } = response;
                    if (data.codResp === undefined) {
                        if (!data) {
                            setLoadingURL(false);
                            setAlertMessageFalha(
                                `Falha ao copiar o link /n [ ${err} ]`
                            );
                        } else {
                            // Copia o link gerado para área de transferência
                            navigator.clipboard.writeText(data);

                            setAlertMessageFalha(`Link copiado com Sucesso!`);

                            // Força um Delay
                            setTimeout(() => {
                                setAlertMessageFalha("");
                                setExibeModalValidacao(true);
                            }, 1200);
                            setLoadingURL(false);
                            return;
                        }
                    } else {
                        if (data.codResp < 0) {
                            setLoadingURL(false);
                            setAlertMessageFalha(data.msgResp);
                            return;
                        }
                    }
                });
        } catch (error) {
            setLoadingURL(false);
            // setAlertType("error");

            if (error.response && error.response?.data) {
                // Specify the encoding (e.g., 'utf-8', 'iso-8859-1')
                const decoder = new TextDecoder("utf-8");
                // Captura mensagem de erro
                const decodedString = decoder.decode(error.response.data);
                // Converte para JSON
                var resp = JSON.parse(decodedString);
                // Exibe Mensagem
                setAlertMessageFalha(resp);
            } else {
                setAlertMessageFalha("Falha " + error.message);
            }
        }
    };

    // Função para baixar pdf Receita
    const downLoadReceitaPDF = async (token = "") => {
        setAlertMessageFalha("");
        setLoadingBaixar(true);

        try {
            // Consome a API para obter os dados necessários do objeto parametros
            const response = await api.get(
                `/farmacia/download/receita/${token}`,
                {
                    responseType: "arraybuffer",
                }
            );

            if (!response) {
                setLoadingBaixar(false);
                return;
            }

            // Converte a resposta da API (fastReport) em Blob
            const blob = new Blob([response.data], { type: "application/pdf" });

            // Captura o nome do Arquivo enviado pela API no content-disposition
            const filename = response.headers["content-disposition"]
                .split("filename=")[1]
                .split(";")[0]
                .trim();

            // Cria um Document Html como um link ( tag a )
            let alink = document.createElement("a");

            // Convert o Blob em uma URL
            const url = URL.createObjectURL(blob);

            // Seta a URL no link do Document
            alink.href = url;

            // Seta o nome do Arquivo no link para Download
            alink.download = filename;

            // Simula o Click para Iniciar o Download
            alink.click();

            // Altera o status do Spinning
            setLoadingBaixar(false);
            return true;
        } catch (error) {
            setLoadingBaixar(false);
            // setAlertType("error");

            if (error.response && error.response?.data) {
                // Specify the encoding (e.g., 'utf-8', 'iso-8859-1')
                const decoder = new TextDecoder("utf-8");
                // Captura mensagem de erro
                const decodedString = decoder.decode(error.response.data);
                // Converte para JSON
                var resp = JSON.parse(decodedString);
                // Exibe Mensagem
                setAlertMessageFalha(resp.msgResp);
            } else {
                setAlertMessageFalha("Falha " + error.message);
            }
        }
    };

    // Lê o frame do desing e abe painel de impressão da Receita
    const handlePrintReceita = async () => {
        // Carrega frame em específico
        const iframe = document.getElementById("pdfReceita");

        // 2. Ocultar o iframe
        if (iframe) {
            iframe.style.display = "none";
        }

        // 3. Abre a Abre Painel de Impressão
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
        };
    };

    // Busca FastReport MemoStream da Receita
    const imprimirReceitaPDF = async (token = "") => {
        setAlertMessageFalha("");
        setLoadingImprimir(true);

        try {
            // Consome a API para obter os dados
            const response = await api.get(
                `/farmacia/impressao/receita/${token}`,
                {
                    responseType: "arraybuffer",
                }
            );

            if (!response) {
                setLoadingImprimir(false);
                return;
            }

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            setPdfUrl(url);

            // Chama painel de impressão
            handlePrintReceita();
            setLoadingImprimir(false);
        } catch (error) {
            setLoadingImprimir(false);

            if (error.response && error.response?.data) {
                // Specify the encoding (e.g., 'utf-8', 'iso-8859-1')
                const decoder = new TextDecoder("utf-8");
                // Captura mensagem de erro
                const decodedString = decoder.decode(error.response.data);
                // Converte para JSON
                var resp = JSON.parse(decodedString);
                // Exibe Mensagem
                setAlertMessageFalha(resp.msgResp);
            } else {
                setAlertMessageFalha(error.message + " " + error.stack);
            }
        }
    };

    // Executa no primeiro render do componente
    useEffect(() => {
        // Recupera os parâmetros da rota
        parametroToken = !match.params.token ? "" : match.params.token;

        // Se for passado um parametro válido seta no form
        if (parametroToken && parametroToken.length === 6) {
            form.setFieldValue("token", parametroToken);
        }
    }, []);

    return (
        <>
            {/* Modal de Impressão */}
            {pdfUrl && (
                <iframe
                    id="pdfReceita"
                    src={pdfUrl}
                    type="application/pdf"
                    title="Relatório"
                    style={{ border: "none" }}
                />
            )}

            {/* Modal de Copia URL de Assinatura */}
            <Modal
                icon={LinkOutlined}
                width={500}
                centered={true}
                title={
                    <div
                        style={{
                            display: "flex",
                            fontSize: "2.3rem",
                            justifyContent: "center",
                        }}
                    >
                        <LinkOutlined />
                        <div />
                        <span
                            style={{
                                marginLeft: 10,
                                fontSize: ".8rem",
                                textAlign: "center",
                            }}
                        >
                            {" "}
                            INSTRUÇÕES PARA VALIDAÇÃO DA <br /> ASSINATURA
                            DIGITAL POR URL
                        </span>
                    </div>
                }
                open={exibeModalValidacao}
                // onOk={() =>
                //     (window.location.href =
                //         "https://validar.iti.gov.br/index.html")
                // }
                // onCancel={() => setExibeModalValidacao(false)}
                footer={[
                    <>
                        <hr style={{ marginBottom: 10 }} />
                        <Button
                            key="cancel"
                            onClick={() => setExibeModalValidacao(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() =>
                                window.open(URL_VALIDADOR_ITI, "_blank")
                            }
                        >
                            Continuar
                        </Button>
                    </>
                ]}
            >
                <p
                    style={{
                        fontSize: ".8rem",
                        fontWeight: 500,
                        color: "#892929ff",
                        textAlign: "center",
                        padding: 5,
                    }}
                >
                    Leia com Atenção todos os itens abaixo antes de clicar no
                    botão Continuar
                </p>

                <hr />
                <Steps
                    style={{ fontSize: "0.5rem", marginRight: 5 }}
                    progressDot
                    current={4}
                    direction="vertical"
                    items={[
                        {
                            title: (
                                <span className="step-titles">
                                    Acionando no botão [ <b>Continuar</b> ] você
                                    será redirecionado ao site oficial de
                                    validação de assintaturas.
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="step-titles">
                                    Após ser redirecionado, localize na pagina e
                                    selecione a opção ( Colar URL ).
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="step-titles">
                                    Na caixa de digitação tecle [ <b>Ctrl+V</b>{" "}
                                    ] para colar a URL, em seguida clique no
                                    botão [ <b>Enviar</b> ].
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="step-titles">
                                    Localize na página a expressão{" "}
                                    <span
                                        style={{
                                            color: "blue",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Assinatura Aprovada
                                    </span>{" "}
                                    , e conclua a venda.
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="step-titles">
                                    No caso de{" "}
                                    <span
                                        style={{
                                            color: "red",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Assinatura Reprovada{" "}
                                    </span>
                                    , comunique ao Paciente que o mesmo deverá
                                    solicitar
                                    <b>
                                        {" "}
                                        uma nova receita devidamente assinada{" "}
                                    </b>
                                    , para que a venda possa ser realizada.
                                </span>
                            ),
                        },
                    ]}
                />
            </Modal>

            {/* Modal QRCode */}
            <Modal
                style={{ padding: 5 }}
                width={330}
                centered={true}
                title="QRCode"
                open={exibeModalQrCode}
                onCancel={() => setExibeModalQrCode(false)}
                footer={null}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ display: "block", textAlign: "center" }}>
                        <Space direction="horizontal" align="center">
                            <QRCode
                                level="H"
                                size={200}
                                value={qrCodeValue || "-"}
                            />
                        </Space>
                        <Space
                            style={{
                                display: "flex",
                                // color: "#0712b4ff",
                                fontWeight: 500,
                                border: "0.5px solid #8c8a8aff",
                                borderRadius: 5,
                                padding: 3,
                                fontSize: "0.8rem",
                                justifyContent: "center",
                            }}
                        >
                            <div>
                                {" "}
                                Cód.Scaneado:{" "}
                                <span
                                    style={{
                                        marginLeft: 3,
                                        fontSize: "1.2rem",
                                        color: "#0712b4ff",
                                    }}
                                >
                                    {codAcessoQRCode}
                                </span>
                            </div>
                        </Space>
                    </div>
                </div>
            </Modal>

            {/* Menu de Opçoes */}
            <div className="background-full">
                <div className="container-form">
                    <Form
                        form={form}
                        name="form-validasign"
                        layout="vertical"
                        className="form fadeInDown"
                        onFinish={onFinishForm}
                    >
                        {/* Logo do sistema  */}
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "0px",
                            }}
                        >
                            <br />
                            <span
                                style={{
                                    color: "#003f78",
                                    marginTop: 2,
                                    fontWeight: 500,
                                    fontSize: "0.85rem",
                                }}
                            >
                                <img src={amparaLogo} alt="" height="30px" />
                                <br />
                                <FileProtectOutlined
                                    style={{ fontSize: "1.5rem" }}
                                />{" "}
                                Validador de Receitas Digitais AMPARA
                                <hr />
                            </span>
                        </div>

                        {/* Botões de Opções */}
                        <Row gutter={12}>
                            <Col xs={24} md={24} lg={24} xl={24}>
                                <div
                                    style={{
                                        alignItems: "center",
                                        alignContent: "center",
                                        textAlign: "center",
                                        // width: "100%",
                                    }}
                                >
                                    {alertMessageFalha && (
                                        <div
                                            style={{
                                                display: alertMessageFalha
                                                    ? "block"
                                                    : "none",
                                                textAlign: "center",
                                                color: "#ee4141fc",
                                                fontWeight: 500,
                                                marginTop: 5,
                                            }}
                                        >
                                            {alertMessageFalha}
                                            <hr style={{ marginTop: 5 }} />
                                        </div>
                                    )}

                                    {/* Input Token */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: 0,
                                        }}
                                    >
                                        <Form.Item
                                            name="token"
                                            label="Informe o Token:"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: 15,
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        validationMessages.required,
                                                },
                                                {
                                                    min: 6,
                                                    message:
                                                        "Obrigatório 06 caracteres.",
                                                },
                                                {
                                                    max: 6,
                                                    message:
                                                        "Obrigatório 06 caracteres.",
                                                },
                                                () => ({
                                                    validator(_, value) {
                                                        return CustomValidations(
                                                            validationType.letrasENumeros,
                                                            value
                                                        );
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input
                                                autoFocus
                                                placeholder="Token da Receita"
                                                minLength={6}
                                                maxLength={6}
                                                value={valueToken}
                                                onChange={() =>
                                                    setAlertMessageFalha("")
                                                }
                                                style={{
                                                    width: 150,
                                                    fontSize: "1rem",
                                                    fontWeight: 500,
                                                    textAlign: "center",
                                                    marginLeft: 30,
                                                }}
                                            />
                                        </Form.Item>

                                        <Tooltip
                                            title="Limpar"
                                            color={"blue"}
                                            style={{
                                                fontSize: "0.5rem",
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    form.resetFields(),
                                                        setAlertMessageFalha(
                                                            ""
                                                        );
                                                }}
                                                icon={<CloseCircleOutlined />}
                                                style={{
                                                    color: "#9c0306ff",
                                                    fontSize: "0.9rem",
                                                    marginTop: 50,
                                                    border: 0,
                                                    textAlign: "center",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>

                                    {/* Baixar Receita */}
                                    <Form.Item
                                        style={{
                                            marginBottom: 5,
                                            textAlign: "center",
                                            alignItems: "center",
                                            alignContent: "center",
                                        }}
                                    >
                                        <Button
                                            className="btnOpcoes"
                                            type="primary"
                                            name="btnBaixar"
                                            htmlType="submit"
                                            loading={loadingBaixar}
                                            onClick={() => {
                                                onClickSubmit(),
                                                    setAcaoBotao(1);
                                            }}
                                        >
                                            <CloudDownloadOutlined
                                                style={{ fontSize: "20px" }}
                                            />{" "}
                                            Baixar Receita PDF
                                        </Button>
                                    </Form.Item>

                                    {/* Imprimir Receita */}
                                    <Form.Item
                                        style={{
                                            display: dispositivoMovel
                                                ? "none"
                                                : "block",
                                            marginBottom: 5,
                                        }}
                                    >
                                        <Button
                                            className="btnOpcoes"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingImprimir}
                                            onClick={() => {
                                                onClickSubmit(),
                                                    setAcaoBotao(2);
                                            }}
                                        >
                                            <PrinterOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Imprimir Receita
                                        </Button>
                                    </Form.Item>

                                    {/* Gera QRCode para Validar Assinatura */}
                                    <Form.Item style={{ marginBottom: "5px" }}>
                                        <Button
                                            className="btnOpcoes"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingQRCode}
                                            onClick={() => setAcaoBotao(4)}
                                        >
                                            <QrcodeOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Exibir QrCode da Receita
                                        </Button>
                                    </Form.Item>

                                    {/* Captura Link URL para Validar Assinatura */}
                                    <Form.Item style={{ marginBottom: "5px" }}>
                                        <Button
                                            className="btnOpcoes"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingURL}
                                            onClick={() => setAcaoBotao(3)}
                                        >
                                            <LinkOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Copiar URL da Assinatura Digital
                                        </Button>
                                    </Form.Item>

                                    {/* Redireciona para Validador ITI */}
                                    <Form.Item style={{ marginTop: "0px" }}>
                                        <Button
                                            className="btnOpcoes"
                                            color="cyan"
                                            variant="solid"
                                            htmlType="submit"
                                            onClick={() => setAcaoBotao(5)}
                                            loading={loadingValidaITI}
                                        >
                                            <QrcodeOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Validador I.T.I.
                                            <img
                                                src="https://validar.iti.gov.br/imagens/govbr.svg"
                                                width={50}
                                                height={50}
                                                alt="validar.iti.gov.br"
                                            />
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>

                        {/* Linha Antes Rodapé */}
                        <hr />

                        {/* Rodapé */}
                        <footer
                            style={{
                                height: 18,
                                fontSize: "0.6rem",
                                color: "#22368eff",
                                fontFamily:
                                    "Google San FlexGoogle Sans Flex, -apple-system, BlinkMacSystemFont, sans-serif",
                                letterSpacing: "1px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                {NOME_SISTEMA} {VERSAO_SISTEMA}
                                <a href="https://ampara.com.br/contato">
                                    Dúvidas <QuestionCircleOutlined />
                                </a>
                            </div>
                        </footer>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ValidaSignReceita;
