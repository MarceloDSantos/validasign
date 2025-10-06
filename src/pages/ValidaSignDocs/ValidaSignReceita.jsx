import React, { useState, useEffect } from "react";
import { Alert, Button, Col, Form, Input, Row, Tooltip } from "antd";
import {
    PrinterOutlined,
    SignatureOutlined,
    CloudDownloadOutlined,
    FileProtectOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import {
    CustomValidations,
    validationMessages,
    validationType,
} from "../../helpers/CustomValidations";
import { isMobile } from "../../helpers/FuncoesExtras";
import { normalizeAlphaNumeric } from "../../helpers/StringHelpers";

import axios from "axios";
import api from "../../api";

import amparaLogo from "../../images/ampara-logo-transparente.png";
import { NOME_SISTEMA, VERSAO_SISTEMA } from "../../helpers/Constants";

import "../Animacoes.css";
import "./ValidaSignReceita.css";

const ValidaSignReceita = ({ match }) => {
    // const { handleLogout } = useContext(Context);
    const [dispositivoMovel, setDispositivoMovel] = React.useState(isMobile());
    const [loading, setLoading] = useState(false);
    const [loadingBaixar, setLoadingBaixar] = useState(false);
    const [loadingImprimir, setLoadingImprimi] = useState(false);
    const [loadingValidar, setLoadingValidar] = useState(false);
    // const [alertMessage, setAlertMessage] = useState("");
    // const [alertType, setAlertType] = useState("error");
    const [acaoBotao, setAcaoBotao] = useState(0);
    const [valueToken, setValueToken] = useState("");
    const [alertMessageFalha, setAlertMessageFalha] = useState("");

    const [form] = Form.useForm();

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
        setAlertMessageFalha('');

        // Baixar
        if (acaoBotao === 1) {
            await downLoadReceitaPDF(value.token);
        } else if (acaoBotao === 2) {
            console.log("Imprimir");
        } else console.log("Validar");
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
            <div className="background-full">
                <div className="container-form">
                    {/* Exibe Loading */}
                    {/* <Spin spinning={loading}> */}
                    {/* Exibe o alerta/mensagem caso possua mensagem definida  */}
                    {/* {alertMessage && (
                        <>
                            <Alert
                                message={alertMessage}
                                type={alertType}
                                showIcon
                            />
                            <br />
                        </>
                    )} */}

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
                                    marginTop: "2px",
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
                                        width: "100%",
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
                                            }}
                                        >
                                            {alertMessageFalha}
                                            <hr/>
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
                                                onClick={() =>
                                                    form.resetFields()
                                                }
                                                icon={<CloseCircleOutlined />}
                                                style={{
                                                    color: "#9c0306ff",
                                                    fontSize: "0.9rem",
                                                    marginTop: 37,
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
                                            // htmlType="submit"
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
                                            onClick={() => setAcaoBotao(2)}
                                        >
                                            <PrinterOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Imprimir Receita
                                        </Button>
                                    </Form.Item>

                                    {/* Valida Assinatura */}
                                    <Form.Item style={{ marginBottom: 15 }}>
                                        <Button
                                            className="btnOpcoes"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingValidar}
                                            onClick={() => setAcaoBotao(3)}
                                        >
                                            <SignatureOutlined
                                                style={{ fontSize: "20px" }}
                                            />
                                            Validar Assinatura Digital
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
