import React, { useState } from "react";
import { Alert, Button, Col, Form, Input, Row, Tooltip } from "antd";
import {
    PrinterOutlined,
    SignatureOutlined,
    CloudDownloadOutlined,
    FileProtectOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { validationMessages } from "../../helpers/CustomValidations";
import { isMobile } from "../../helpers/FuncoesExtras";

// import axios from "axios";
// import api from "../../api";

import amparaLogo from "../../images/ampara-logo-transparente.png";
import { NOME_SISTEMA, VERSAO_SISTEMA } from "../../helpers/Constants";

import "./ValidaSignReceita.css";
import "../Animacoes.css";




// const isMobile = () => {
//       const userAgent = navigator.userAgent;
//       return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
//     };

// Inicia a Página/Componente
const ValidaSignReceita = () => {
    // const { handleLogout } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [loadingBaixar, setLoadingBaixar] = useState(false);
    const [loadingImprimir, setLoadingImprimi] = useState(false);
    const [loadingValidar, setLoadingValidar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [acaoBotao, setAcaoBotao] = useState(0);

    const [dispositivoMovel, setDispositivoMovel] = React.useState(isMobile());

    const [value, setValue] = useState("");

    const [form] = Form.useForm();

    const normalizeAlphaNumeric = (value) => {
        if (!value) {
            return value;
        }
        // Remove caracterer dif de letras e números
        return value.replace(/[^a-zA-Z0-9]/g, "");
    };

    const onFinishForm = (value) => {
        if (value.token.trim().length === 0 || value.token === undefined) {
            return;
        }
        // Baixar
        if (acaoBotao === 1) {
            console.log("Baixar");
        } else if (acaoBotao === 2) {
            console.log("Imprimir");
        } else console.log("Validar");
    };


    return (
        <>
            <div className="background-full">
                <div className="container-form">
                    {/* Exibe Loading */}
                    {/* <Spin spinning={loading}> */}
                    {/* Exibe o alerta/mensagem caso possua mensagem definida  */}
                    {alertMessage && (
                        <>
                            <Alert
                                message={alertMessage}
                                type={alertType}
                                showIcon
                            />
                            <br />
                        </>
                    )}

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
                                            ]}
                                            normalize={normalizeAlphaNumeric} // Somente letras números
                                        >
                                            <Input
                                                autoFocus
                                                placeholder="Token da Receita"
                                                minLength={6}
                                                maxLength={6}
                                                value={value}
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
                                                fontSize: "0.3rem",
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
                                            htmlType="submit"
                                            name="btnBaixar"
                                            loading={loadingBaixar}
                                            onClick={() => setAcaoBotao(1)}
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
                                            loading={loadingBaixar}
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
                                            loading={loadingBaixar}
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
