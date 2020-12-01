import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { Player, ControlBar, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from "react-bootstrap-icons";
import * as constant from "../components/constants";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormControl,
  InputGroup,
  Modal
} from "react-bootstrap";
import Navbars from "../templates/Navbars";
import Sidebar from "../templates/Sidebar";
import favo_icon from "../assets/images/user_manage/stra_icon_org.png";
import unfavo_icon from "../assets/images/user_manage/star_icon_grey.png";

import "../assets/Users.css";
import "../assets/Dashboard.css";
import WatchLogHelper from "../utils/WatchLogHelper";

class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: localStorage.getItem("jwt"),
      categories: [],
      sessionsCategories: [],
      video_url: "",
      categoryIndex: 0,
      sessionIndex: 0,
      favourite_ids: [],
      videoSortDirection: "desc",
      showDetailFlag: true,
      show_detail_state: false
    };

    this.playCounts = {};
  }
  /**
   *
   */
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    const { updateWindowDimensions, playCounts } = this;
    const bindedThis = this;
    window.addEventListener("beforeunload", function(event) {
      window.removeEventListener(
        "resize",
        updateWindowDimensions.bind(bindedThis)
      );
      clearInterval(bindedThis.timer);
      WatchLogHelper.sendSessionsLogs(playCounts);
    });

    axios
      .get(constant.baseURL + "favourites/me/ids", {
        headers: {
          Authorization: `Bearer ${this.state.jwt}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            favourite_ids: res.data
          });
        }
      });
    axios
      .get(constant.baseURL + "session-categories", {
        headers: {
          Authorization: `Bearer ${this.state.jwt}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          let k = 0;
          res.data.forEach(category => {
            if (k === 0) {
              category.filter_state = true;
            } else {
              category.filter_state = false;
            }
            this.setState(state => {
              const sessionsCategories = [
                ...state.sessionsCategories,
                category
              ];
              return {
                sessionsCategories
              };
            });
            k++;
          });

          localStorage.setItem(
            "session_List",
            JSON.stringify(this.state.sessionsCategories)
          );
          // searchSessions = this.state.sessionsCategories;
        } else {
          return false;
        }
      }, []);

    this.timer = setInterval(() => {
      if (
        this.player != null &&
        this.player.getState().player.hasStarted &&
        !this.player.getState().player.paused
      ) {
        const currentSessionID = this.state.sessionsCategories[
          this.state.categoryIndex
        ].sessions[this.state.sessionIndex].id;
        const currentCount = this.playCounts[currentSessionID];
        this.playCounts[currentSessionID] =
          currentCount == null ? 1 : currentCount + 1;
      }
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.updateWindowDimensions.bind(this)
    );
    clearInterval(this.timer);

    WatchLogHelper.sendSessionsLogs(this.playCounts);
  }

  updateWindowDimensions() {
    this.setState(
      {
        width: window.innerWidth,
        height: window.innerHeight
      },
      function() {
        if (
          (this.state.width <= 1024 && this.state.width < this.state.height) ||
          (this.state.width <= 1024 && this.state.height < 910)
        ) {
          this.setState({
            showDetailFlag: false
          });
        } else {
          this.setState({
            showDetailFlag: true
          });
        }
      }
    );
  }

  handleDetailClose = () => {
    this.setState({ show_detail_state: false });
  };

  // {{baseUrl}}/notifications/me?_sort=created_at:DESC
  playVideo = (video_url, categoryIndex, sessionIndex) => {
    this.setState({
      video_url: video_url,
      categoryIndex: categoryIndex,
      sessionIndex: sessionIndex
    });
    if (
      (this.state.width <= 1024 && this.state.width < this.state.height) ||
      (this.state.width <= 1024 && this.state.height < 910)
    ) {
      this.setState({
        show_detail_state: true
      });
    }
  };

  searchExpert = event => {
    let searchContent = event.target.value;
    let searchSessionList = [];
    searchSessionList = JSON.parse(localStorage.getItem("session_List"));
    // const searchSessions = JSON.parse(localStorage.getItem("session_List"));
    this.setState(() => {
      const sessionsCategories = searchSessionList.filter(item => {
        const sub_session = item.sessions.filter(res => {
          if (
            res !== null &&
            (res.Speaker.toLowerCase().includes(searchContent.toLowerCase()) ||
              res.Title.toLowerCase().includes(searchContent.toLowerCase()))
          ) {
            return res;
          }
          // return null;
        });
        if (sub_session.length !== 0) {
          item.sessions = sub_session;
          return item;
        }
      });
      return {
        sessionsCategories
      };
    });
  };

  showVideoInfo = () => {
    const { t } = this.props;
    if (this.state.video_url !== "" && this.state.video_url !== null) {
      const currentSession = this.state.sessionsCategories[
        this.state.categoryIndex
      ].sessions[this.state.sessionIndex];
      return (
        <div style={{ width: "100%" }}>
          <Player
            playsInline
            autoPlay={true}
            width="100%"
            ref={player => {
              this.player = player;
            }}
            poster={currentSession.video.Thumbnail.url}
            src={this.state.video_url}
          >
            <ControlBar autoHide={true} className="my-class" />
            <BigPlayButton position="center" />
          </Player>
          <Row className="mt-2 px-3">
            <Col
              md={10}
              className="d-flex justify-content-start align-items-center flex-column"
            >
              <h6
                className="text-green text-bold"
                style={{ width: "100%", fontSize: "20px" }}
              >
                {currentSession.Title}
              </h6>
              <h6
                className="text-grey text-bold"
                style={{ width: "100%", fontSize: "14px" }}
              >
                {"Presented by: " + currentSession.Speaker}
              </h6>
            </Col>
          </Row>
          <Row className="mt-4 px-3">
            <Col>
              <p className="text-bold text-left mb-1 pb-1">
                {t("program_session.description")}
              </p>
              <p style={{ fontSize: "14px" }}>{currentSession.Description}</p>
            </Col>
          </Row>
        </div>
      );
    } else if (this.state.sessionsCategories[this.state.categoryIndex]) {
      const currentSession = this.state.sessionsCategories[
        this.state.categoryIndex
      ].sessions[this.state.sessionIndex];
      return (
        <div style={{ width: "100%" }}>
          <img
            src={currentSession.video.Thumbnail.url}
            width="100%"
            alt="thumbnail"
          />
          <Row className="mt-2 px-3">
            <Col
              md={10}
              className="d-flex justify-content-start align-items-center flex-column"
            >
              <h6
                className="text-green text-bold"
                style={{ width: "100%", fontSize: "20px" }}
              >
                {currentSession.Title}
              </h6>
              <h6
                className="text-grey text-bold"
                style={{ width: "100%", fontSize: "14px" }}
              >
                {"Presented by: " + currentSession.Speaker}
              </h6>
            </Col>
          </Row>
          <Row className="mt-4 px-3">
            <Col>
              <p className="text-bold text-left mb-1 pb-1">
                {t("program_session.description")}
              </p>
              <p style={{ fontSize: "14px" }}>{currentSession.Description}</p>
            </Col>
          </Row>
        </div>
      );
    }
  };

  filterItemChange = category => {
    this.setState(state => {
      const sessionsCategories = state.sessionsCategories.map(res => {
        if (res.Title === category) {
          // let state_temp = res.filter_state;
          res.filter_state = true;
        } else {
          res.filter_state = false;
        }
        return res;
      });
      return {
        sessionsCategories
      };
    });
  };

  changeFavourite = (index, id) => {
    if (index) {
      let data = {
        sessionID: id
      };
      axios
        .put(constant.baseURL + "favourites/me/removeSession", data, {
          headers: {
            Authorization: `Bearer ${this.state.jwt}`
          }
        })
        .then(res => {
          if (res.status === 200) {
            axios
              .get(constant.baseURL + "favourites/me/ids", {
                headers: {
                  Authorization: `Bearer ${this.state.jwt}`
                }
              })
              .then(item => {
                this.setState({
                  favourite_ids: item.data
                });
              });
          }
        });
    } else {
      let data = {
        sessionID: id
      };
      axios
        .put(constant.baseURL + "favourites/me/addSession", data, {
          headers: {
            Authorization: `Bearer ${this.state.jwt}`
          }
        })
        .then(res => {
          if (res.status === 200) {
            axios
              .get(constant.baseURL + "favourites/me/ids", {
                headers: {
                  Authorization: `Bearer ${this.state.jwt}`
                }
              })
              .then(item => {
                this.setState({
                  favourite_ids: item.data
                });
              });
          }
        });
    }
  };

  videoSortDirectionChange = () => {
    if (this.state.videoSortDirection === "desc") {
      this.setState({
        videoSortDirection: "asc"
      });
    } else {
      this.setState({
        videoSortDirection: "desc"
      });
    }
  };

  showVideoList = () => {
    let videoSortDirection = this.state.videoSortDirection;

    if (this.state.sessionsCategories) {
      const session_list = this.state.sessionsCategories.map(
        (category, categoryIndex) => {
          if (category.sessions && category.filter_state) {
            const session_sublist = category.sessions
              .sort(function(a, b) {
                let dateA = a.video.Thumbnail.created_at;
                let dateB = b.video.Thumbnail.created_at;
                if (dateA < dateB) {
                  let result = videoSortDirection === "desc" ? 1 : -1;
                  return result;
                }
                if (dateA > dateB) {
                  let result = videoSortDirection === "desc" ? -1 : 1;
                  return result;
                }
                return 0;
              })
              .map((session, sessionIndex) => {
                if (session !== null) {
                  let favo_icon_img =
                    this.state.favourite_ids.length !== 0 &&
                    this.state.favourite_ids.sessions.includes(session.id)
                      ? favo_icon
                      : unfavo_icon;
                  let video_url =
                    session.video.videoURL !== null
                      ? session.video.videoURL
                      : "";
                  return (
                    <Row
                      className="table_row mt-1 mb-1 p-2 d-flex align-items-center"
                      key={session.id}
                    >
                      <Col
                        style={{
                          width: "30%",
                          flexBasis: "unset",
                          flexGrow: "unset"
                        }}
                        className="pl-1 pr-1 d-flex align-items-center"
                        onClick={this.playVideo.bind(
                          this,
                          video_url,
                          categoryIndex,
                          sessionIndex
                        )}
                      >
                        <div
                          className=" d-flex align-items-center justify-content-center"
                          style={{
                            backgroundImage: `url(${
                              session.video.Thumbnail.url
                            })`,
                            width: "80%",
                            height: "90px",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                          }}
                        >
                          <i
                            style={{ fontSize: "35px" }}
                            className="fa fa-play"
                          />
                        </div>
                      </Col>
                      <Col
                        style={{
                          width: "20%",
                          flexBasis: "unset",
                          flexGrow: "unset"
                        }}
                        className="pl-1 pr-1"
                        onClick={this.playVideo.bind(
                          this,
                          video_url,
                          categoryIndex,
                          sessionIndex
                        )}
                      >
                        {session.Title}
                      </Col>
                      <Col
                        style={{
                          width: "30%",
                          flexBasis: "unset",
                          flexGrow: "unset"
                        }}
                        className="pl-1 pr-1"
                        onClick={this.playVideo.bind(
                          this,
                          video_url,
                          categoryIndex,
                          sessionIndex
                        )}
                      >
                        {session.Speaker}
                      </Col>
                      <Col
                        style={{
                          width: "10%",
                          flexBasis: "unset",
                          flexGrow: "unset"
                        }}
                        className="pl-1 pr-1"
                        onClick={this.playVideo.bind(
                          this,
                          video_url,
                          categoryIndex,
                          sessionIndex
                        )}
                      >
                        {session.video.Duration}
                      </Col>
                      <Col
                        style={{
                          width: "10%",
                          flexBasis: "unset",
                          flexGrow: "unset"
                        }}
                        className="pl-1 pr-1"
                      >
                        <Button
                          className="bg-transparent pl-1 pr-1"
                          variant="light"
                          onClick={this.changeFavourite.bind(
                            this,
                            this.state.favourite_ids.length !== 0
                              ? this.state.favourite_ids.sessions.includes(
                                  session.id
                                )
                              : false,
                            session.id
                          )}
                        >
                          <img
                            src={favo_icon_img}
                            alt="favorite"
                            width="20px"
                            height="auto"
                          />
                        </Button>
                      </Col>
                    </Row>
                  );
                }
                return "";
              });
            return session_sublist;
          } else {
            return "";
          }
        }
      );
      return session_list;
    } else {
      return "";
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div className="">
        <Container className="">
          <Navbars />
          <Row>
            <Col md={2} className="pl-0 pr-0">
              <Sidebar active_class="home" />
            </Col>
            <Col
              md={10}
              className="about_body d-flex flex-column justify-content-between align-content-between"
            >
              <Row className="m-2">
                <Row style={{ width: "100%" }}>
                  <Col>
                    <h1 className="mt-3 text-bold">
                      {t("program_session.title")}
                    </h1>
                  </Col>
                </Row>
                <Row
                  className="mt-0 mb-1 p-1 pr-3 pt-3"
                  style={{
                    width: "100%",
                    flexWrap: "nowrap",
                    boxSizing: "border-box"
                  }}
                >
                  <Col
                    md={this.state.showDetailFlag ? 9 : 12}
                    className="profile_info ml-2"
                    style={{ height: "75vh" }}
                  >
                    <div className="pl-4 pr-4 pb-4 pt-3">
                      <Row>
                        <Col
                          md={4}
                          className="pl-0 d-flex justify-content-start align-items-center"
                        >
                          <Form className="search_form">
                            <Form.Group
                              controlId="formSearch"
                              className="mb-1 mt-1"
                            >
                              <InputGroup className="search_box">
                                <InputGroup.Prepend>
                                  <InputGroup.Text id="search">
                                    <Icon.Search size="25" />
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                  type="text"
                                  name="search"
                                  placeholder="Search"
                                  aria-label="Search"
                                  aria-describedby="search"
                                  onChange={this.searchExpert}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Form>
                        </Col>
                        <Col
                          md={8}
                          className="d-flex justify-content-end align-items-center session_category"
                        >
                          {this.state.sessionsCategories.map(res => (
                            <Button
                              className={
                                res.filter_state
                                  ? "bg-orange"
                                  : "bg-orange-opacity"
                              }
                              key={res.id}
                              onClick={this.filterItemChange.bind(
                                this,
                                res.Title
                              )}
                              variant="outline-light"
                            >
                              <span>{res.Title}</span>
                            </Button>
                          ))}
                        </Col>
                      </Row>
                      <Row className="table_header mt-2 mb-1 p-2 pt-3">
                        <Col
                          style={{
                            width: "30%",
                            flexBasis: "unset",
                            flexGrow: "unset"
                          }}
                          className="pl-1 pr-1 text-bold"
                          onClick={this.videoSortDirectionChange}
                          style={{ cursor: "pointer" }}
                        >
                          {t("program_session.table_title.lates_video")}
                          <i className="fa fa-sort ml-4" />
                        </Col>
                        <Col
                          style={{
                            width: "20%",
                            flexBasis: "unset",
                            flexGrow: "unset"
                          }}
                          className="pl-1 pr-1 text-bold"
                        >
                          {t("program_session.table_title.name")}
                        </Col>
                        <Col
                          style={{
                            width: "30%",
                            flexBasis: "unset",
                            flexGrow: "unset"
                          }}
                          className="pl-1 pr-1 text-bold"
                        >
                          {t("program_session.table_title.present_by")}
                        </Col>
                        <Col
                          style={{
                            width: "10%",
                            flexBasis: "unset",
                            flexGrow: "unset"
                          }}
                          className="pl-1 pr-1 text-bold"
                        >
                          {t("program_session.table_title.time")}
                        </Col>
                        <Col
                          style={{
                            width: "10%",
                            flexBasis: "unset",
                            flexGrow: "unset"
                          }}
                          className="pl-1 pr-1 text-bold"
                        />
                      </Row>
                      {this.showVideoList()}
                    </div>
                  </Col>
                  {this.state.showDetailFlag ? (
                    <Col md={3} className="profile_info ml-3 mr-3">
                      <div className="pl-0 pr-0 pb-4">
                        <Row className="pt-0">
                          <Col className="d-flex justify-content-center align-items-center pr-0 pl-0">
                            {this.showVideoInfo()}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
              </Row>

              {/*<p className="text-left pb-2">*/}
              {/*    {t("footer")} */}
              {/*</p>*/}
            </Col>
          </Row>
        </Container>
        <Modal
          show={this.state.show_detail_state}
          onHide={this.handleDetailClose}
          className="showSpeakerDetail"
        >
          <Modal.Body>{this.showVideoInfo()}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="success bg-green"
              onClick={this.handleDetailClose}
              className="pl-5 pr-5 pt-1 pb-1"
            >
              {t("utility.close")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(Sessions);
