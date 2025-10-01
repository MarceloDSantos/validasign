import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Input, Row, Spin, Card } from "antd";

// import axios from "axios";
// import api from "../../api";

import amparaLogo from "../../images/ampara-logo-transparente.png";
import { NOME_SISTEMA, VERSAO_SISTEMA } from "../../helpers/Constants";

// import "ValidaSignDocs/ValidaSignRceita.css";
import "../Animacoes.css";

// Inicia a Página/Componente
const ValidaSignReceita = () => {
    // const { handleLogout } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [form] = Form.useForm();

    // Executa no primeiro render do componente
    // useEffect(() => {
    //     setAlertMessage("");
    //     setLoading(true);

    //     // Consome a API para alterar a senha
    //     api.get("/usuario/obter-email-usuario")
    //         .then((response) => {
    //             const { data } = response;

    //             if (data.codResp > 0) {
    //                 // Dados de busca para a primeira chamada ao carregar a página
    //                 initialValues.emailAtual = data.email;

    //                 // Passa os dados para o form
    //                 form.setFieldsValue(initialValues);

    //                 setLoading(false);
    //             } else {
    //                 setAlertType("error");
    //                 setAlertMessage(data.msgResp);
    //                 setLoading(false);
    //             }
    //         })
    //         .catch((error) => {
    //             if (axios.isCancel(error)) return;

    //             setAlertType("error");
    //             const { response } = error;

    //             if (response) {
    //                 const { data } = response;

    //                 if (response.status === 401) {
    //                     handleLogout();
    //                 } else if (data && data.msgResp) {
    //                     if (data.validacoes) {
    //                         data.validacoes.map((validacao) => {
    //                             return form.setFields([
    //                                 {
    //                                     name: validacao.campo.split("."),
    //                                     errors: [validacao.validacao],
    //                                 },
    //                             ]);
    //                         });
    //                     }

    //                     setAlertMessage(data.msgResp);
    //                 } else {
    //                     setAlertMessage("Falha ao processar requisição");
    //                 }
    //             } else {
    //                 setAlertMessage("Falha ao realizar requisição");
    //             }

    //             setLoading(false);
    //         });

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div className="container-login background-begin">
            {/* Exibe Loading */}
            <Spin spinning={loading}>
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
                    name="login-form"
                    className="login-form fadeInDown"
                    style={{
                        padding: "15px 30px 0px",
                        display: alertSucesso.length > 0 ? "none" : "block",
                    }}
                >
                    {/* Logo do sistema  */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "0px",
                            // display: 'grid'
                        }}
                    >
                        <img src={amparaLogo} alt="" height="40px" />
                        <br />
                        <h2 style={{ color: "#003f78", marginTop: "2px" }}>
                            {NOME_SISTEMA} {VERSAO_SISTEMA}
                            <br />
                        </h2>
                    </div>


                </Form>
            </Spin>
        </div>
    );
};

export default ValidaSignReceita;
