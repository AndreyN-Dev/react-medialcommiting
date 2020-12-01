import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import * as constant from "../components/constants";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import Navbars from "../templates/Navbars";
import Sidebar from "../templates/Sidebar";

import "../assets/Users.css";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: localStorage.getItem("jwt"),
      subject: "",
      question: "",
      send_email: "",
      show_state: false
    };
  }

  handleClose = () => {
    this.setState({ show_state: false });
  };

  handleShow = () => {
    this.setState({ show_state: true });
  };

  componentDidMount() {
    this.handleShow();
  }

  contactEnterData = event => {
    event.preventDefault();
    let enter_name = event.target.name;
    let enter_value = event.target.value;
    this.setState({
      [enter_name]: enter_value
    });
  };

  sendQuestion = () => {
    let data = {
      subject: this.state.subject,
      content: this.state.question
    };

    axios
      .post(constant.baseURL + "contact-uses", data, {
        headers: {
          Authorization: `Bearer ${this.state.jwt}`
        }
      })
      .then(res => {
        console.log(res);
        this.handleClose();
      });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="">
        <Container className="">
          <Navbars />
          <Row>
            <Col md={2} className="pl-0 pr-0">
              <Sidebar active_class="contact" />
            </Col>
            <Col
              md={10}
              className="about_body d-flex flex-column justify-content-between align-content-between"
            >
              <Row className="d-flex flex-column pl-3 pr-3">
                <h1 className="mt-3 text-bold">{t("help.title")}</h1>
                <h3 className="mt-5 text-bold">
                  {t("help.content_first.title")}
                </h3>
                <p>{t("help.content_first.content")}</p>
                <br />
                <h3 className="text-bold">{t("help.content_second.title")}</h3>
                <p>{t("help.content_second.content")}</p>
                <br />
                <h3 className="text-bold">{t("help.content_third.title")}</h3>
                <p>{t("help.content_third.content")}</p>
                <br />
                <h3 className="text-bold">{t("help.content_forth.title")}</h3>
                <p>{t("help.content_forth.content")}</p>
                <br />
                <h3 className="text-bold">{t("help.content_fifth.title")}</h3>
                <p>{t("help.content_fifth.content")}</p>
              </Row>
            </Col>
          </Row>
          <Modal
            show={this.state.show_state}
            onHide={this.handleClose}
            className="change_pwd_modal"
          >
            <Modal.Header>
              <Modal.Title>{t("contact.title")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="change_pwd_form mt-3">
                {/*<Form.Group controlId="exampleForm.ControlTextarea1">*/}
                {/*  <Form.Control*/}
                {/*    rows="4"*/}
                {/*    placeholder="Question details"*/}
                {/*    required*/}
                {/*    name="subject"*/}
                {/*    type="text"*/}
                {/*    onChange={this.contactEnterData}*/}
                {/*  />*/}
                {/*</Form.Group>*/}
                <Form.Group>
                  <Form.Control
                    as="select"
                    className="mb-2"
                    placeholder="Subject"
                    required
                    name="question"
                    onChange={this.contactEnterData}
                  >
                    <option value="Unable to solve the patient case">
                      Unable to solve the patient case
                    </option>
                    <option value="Unable to answer the quiz">
                      Unable to answer the quiz
                    </option>
                    <option value="Having trouble viewing the videos">
                      Having trouble viewing the videos
                    </option>
                    <option value="Risk calculator link isn’t working">
                      Risk calculator link isn’t working
                    </option>
                    <option value="Other inquiries">
                      Other inquiries
                    </option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={this.sendQuestion}
                className="pl-5 pr-5 pt-1 pb-1"
              >
                {t("utility.send")}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }
}

export default withTranslation()(ContactUs);
