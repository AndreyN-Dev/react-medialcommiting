import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import axios from "axios";
import {Player, ControlBar, BigPlayButton} from "video-react";
import "video-react/dist/video-react.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "react-loader-spinner";
import * as constant from "../components/constants";

import {Container, Row, Col, Button, Modal} from "react-bootstrap";
import Navbars from "../templates/Navbars";
import Sidebar from "../templates/Sidebar";
import center_image from "../assets/images/dashboard/train_center_img.png";
import play_icon from "../assets/images/dashboard/play_icon.png";
import pause_icon from "../assets/images/dashboard/pause_icon.png";
import prev_icon from "../assets/images/dashboard/previous_icon.png";
import next_icon from "../assets/images/dashboard/next_icon.png";
import view_check from "../assets/images/dashboard/Group.png";

import "../assets/Users.css";
import "../assets/Dashboard.css";
import WatchLogHelper from "../utils/WatchLogHelper";

var video_opacity1 = {
    opacity: 1
};
var video_opacity2 = {
    opacity: 0.6
};
var video_view_check1 = {
    display: "none"
};
var video_view_check2 = {
    display: "none"
};

var answer = {};

class Train extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: localStorage.getItem("jwt"),
            clinic_data: "",
            caseID: -1,
            exam_question: "",
            video_url: "",
            index_1: 0,
            index_2: 0,
            play_state: 0,
            selected_player_id: 1,
            makeRead: [0, 0, 0],
            selectedAnswerID: 0,
            selectedAnswerIndex: -1,
            selectedQusetionID: 0,
            question_index: 0,
            submitState: 0,
            startExam: 0,
            trainTab: 1,
            score: 0,
            isPassed: false,
            showDetailFlag: true,
            show_detail_state: false,
            visitID: 0,
            answeredAlready: null,
            answer_view: null
        };

        this.playCounts = {clinic_1: 0, clinic_2: 0};

        this.play = this.play.bind(this);
        this.changeCurrentTime = this.changeCurrentTime.bind(this);
    }

    componentDidMount() {
        const {playCounts, updateWindowDimensions} = this;
        const bindedThis = this;
        window.addEventListener("beforeunload", function (event) {
            window.removeEventListener(
                "resize",
                updateWindowDimensions.bind(bindedThis)
            );

            clearInterval(bindedThis.timer);
            WatchLogHelper.sendMyClinicLogs(bindedThis.state.caseID, playCounts);
        });

        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
        this.setState({
            visitID: this.props.match.params.visitID
        });
        this.loadClinicVideo(this.props.match.params.visitID);
        this.loadExam();
        if (this.state.selected_player_id === 1) {
            video_opacity1 = {
                opacity: 1
            };
            video_opacity2 = {
                opacity: 0.6
            };
        } else {
            video_opacity1 = {
                opacity: 0.6
            };
            video_opacity2 = {
                opacity: 1
            };
        }

        this.timer = setInterval(() => {
            if (
                this.player1 != null &&
                this.player1.getState().player.hasStarted &&
                !this.player1.getState().player.paused
            ) {
                this.playCounts.clinic_1 = this.playCounts.clinic_1 + 1;
            }
            if (
                this.player2 != null &&
                this.player2.getState().player.hasStarted &&
                !this.player2.getState().player.paused
            ) {
                this.playCounts.clinic_2 = this.playCounts.clinic_2 + 1;
            }
        }, 1000);
    }

    componentWillUnmount() {
        window.removeEventListener(
            "resize",
            this.updateWindowDimensions.bind(this)
        );

        clearInterval(this.timer);
        WatchLogHelper.sendMyClinicLogs(this.state.caseID, this.playCounts);
    }

    updateWindowDimensions() {
        this.setState(
            {
                width: window.innerWidth,
                height: window.innerHeight
            },
            function () {
                if (
                    (this.state.width <= 1024 && this.state.width < this.state.height) ||
                    (this.state.width <= 1024 && this.state.height < 800)
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
        this.setState({show_detail_state: false});
    };

    loadClinicVideo = (visitID) => {
        console.log("visiteID", visitID);
        axios
            .get(constant.baseURL + "patient-cases/" + visitID, {
                headers: {
                    Authorization: `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    this.setState(
                        {
                            clinic_data: JSON.stringify(res.data),
                            caseID: res.data.id,
                            answeredAlready: res.data.ansewredAlready
                        },
                        function () {
                            this.setState(
                                {
                                    selectedAnswerID: res.data.Questions[0].options[0].id,
                                    selectedQusetionID: res.data.Questions[0].id
                                },
                                function () {
                                    answer = {
                                        ...answer,
                                        [this.state.selectedQusetionID]: this.state
                                            .selectedAnswerIndex
                                    };
                                }
                            );
                        }
                    );
                }
            });

    }


    // {{baseUrl}}/notifications/me?_sort=created_at:DESC
    playVideo = (video_url, index_1, index_2) => {
        this.setState({
            video_url: video_url,
            index_1: index_1,
            index_2: index_2
        });
    };

    play() {
        this.player2.muted = 1;

        if (this.state.play_state === 0) {
            if (this.state.selected_player_id === 1) {
                this.player1.play();
                this.setState({
                    play_state: 1
                });
            } else {
                this.player2.play();
                this.setState({
                    play_state: 1
                });
            }
        } else {
            if (this.state.selected_player_id === 1) {
                this.player1.pause();
                this.setState({
                    play_state: 0
                });
            } else {
                this.player2.pause();
                this.setState({
                    play_state: 0
                });
            }
        }
    }

    changeCurrentTime(seconds) {
        return () => {
            let play1_state_data = this.player1.getState().player;
            let play2_state_data = this.player2.getState().player;

            if (
                play1_state_data.hasStarted &&
                play1_state_data.duration > play1_state_data.currentTime
            ) {
                // const { player } = this.player1.getState();
                this.player1.seek(play1_state_data.currentTime + seconds);
            } else if (
                play2_state_data.hasStarted &&
                play2_state_data.duration > play2_state_data.currentTime
            ) {
                this.player2.seek(play2_state_data.currentTime + seconds);
            }
        };
    }

    playerSelect = play_index => {
        if (play_index === "play1") {
            this.setState({
                selected_player_id: 1
            });
            this.player2.load();
            let play1_state_data = this.player1.getState().player;
            if (play1_state_data.paused) {
                this.setState({
                    play_state: 1
                });
            } else {
                this.setState({
                    play_state: 0
                });
            }
            // this.player1.subscribeToStateChange(this.handlePlayer1StateChange.bind(this));
        } else {
            this.setState({
                selected_player_id: 2
            });
            this.player1.load();
            let play2_state_data = this.player2.getState().player;
            if (play2_state_data.paused) {
                this.setState({
                    play_state: 1
                });
            } else {
                this.setState({
                    play_state: 0
                });
            }
            // this.player2.subscribeToStateChange(this.handlePlayer2StateChange.bind(this));
        }
    };

    makeRead = index => {
        this.setState(
            state => {
                state.makeRead[index] = index;
                return state.makeRead;
            },
            function () {
                if (
                    this.state.makeRead[1] === 1 &&
                    this.state.makeRead[2] === 2 &&
                    ((this.state.width <= 1024 && this.state.width < this.state.height) ||
                        (this.state.width <= 1024 && this.state.height < 910))
                ) {
                    this.setState({
                        show_detail_state: true
                    });
                }
            }
        );
    };

    selectAnswer = (index, id) => {
        this.setState({
            selectedAnswerIndex: index,
            selectedAnswerID: id
        });
        answer = {
            ...answer,
            [this.state.selectedQusetionID]: index
        };
        console.log("answers", answer);
    };

    nextQuestion = index => {
        let question_id = 0;
        if (this.state.trainTab === 1) {
            let clinic_object = JSON.parse(this.state.clinic_data);
            question_id = clinic_object.Questions[index].id;
        } else {
            question_id = this.state.exam_question.Questions[index].id;
        }
        this.setState(
            {
                question_index: index,
                selectedQusetionID: question_id,
                selectedAnswerIndex: -1
            }
            // ,function () {
            //     answer = {
            //         ...answer,
            //         [this.state.selectedQusetionID]: this.state.selectedAnswerIndex
            //     };
            // }
        );
    };

    submitAnswer = () => {
        this.setState({
            submitState: 1
        });
        let data = {};
        let end_point = "case-answers";
        if (this.state.trainTab === 1) {
            let clinic_object = JSON.parse(this.state.clinic_data);
            data = {
                patient_case: clinic_object.id,
                answers: answer
            };
            end_point = "case-answers";
        } else {
            data = {
                exam: this.state.exam_question.id,
                answers: answer
            };
            end_point = "exam-answers";
        }
        console.log("submit answer", data);
        axios
            .post(constant.baseURL + end_point, data, {
                headers: {
                    Authorization: `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if (res.status === 200) {
                    let answerResult = res.data;
                    console.log("answer_result", res.data);
                    this.setState({
                        submitState: 2,
                        score: answerResult.score,
                        isPassed: answerResult.isPassed
                    });
                    // alert("Submit successfully");
                }
            });
    };

    examTryAgain = () => {
        answer = {};
        this.setState(
            {
                submitState: 0,
                index_1: 0,
                index_2: 0,
                play_state: 0,
                selected_player_id: 1,
                makeRead: [0, 0, 0],
                selectedAnswerID: 0,
                selectedAnswerIndex: 0,
                question_index: 0
            },
            function () {
                if (this.state.trainTab === 1) {
                    this.setState(
                        {
                            startExam: 0,
                            selectedQusetionID: JSON.parse(this.state.clinic_data)
                                .Questions[0].id
                        },
                        function () {
                            answer = {
                                [this.state.selectedQusetionID]: 0
                            };
                        }
                    );
                    this.handleDetailClose();
                } else {
                    this.setState(
                        {
                            startExam: 1,
                            selectedQusetionID: this.state.exam_question.Questions[0].id
                        },
                        function () {
                            answer = {
                                [this.state.selectedQusetionID]: 0
                            };
                        }
                    );
                }
            }
        );
    };

    showVideoInfo = () => {
        const {t} = this.props;
        if (this.state.selected_player_id === 1) {
            video_opacity1 = {
                opacity: 1
            };
            video_opacity2 = {
                opacity: 0.6
            };
        } else {
            video_opacity1 = {
                opacity: 0.6
            };
            video_opacity2 = {
                opacity: 1
            };
        }
        if (this.state.makeRead[1] === 1) {
            video_view_check1 = {
                display: "block"
            };
        } else {
            video_view_check1 = {
                display: "none"
            };
        }
        if (this.state.makeRead[2] === 2) {
            video_view_check2 = {
                display: "block"
            };
        } else {
            video_view_check2 = {
                display: "none"
            };
        }
        if (this.state.clinic_data !== "") {
            //{'https://strapi-msd-be.s3.eu-west-1.amazonaws.com/48bac894c0494b3e9d8087ab3cb25e7f.mp4'}
            let clinic_object = JSON.parse(this.state.clinic_data);
            let first_video_url =
                clinic_object.FirstOpinion.videoURL !== null
                    ? clinic_object.FirstOpinion.videoURL
                    : "";
            let second_video_url =
                clinic_object.SecondOpinion.videoURL !== null
                    ? clinic_object.SecondOpinion.videoURL
                    : "";
            let first_thumbnail_url =
                clinic_object.FirstOpinion.Thumbnail.url !== null
                    ? clinic_object.FirstOpinion.Thumbnail.url
                    : null;
            let second_thumbnail_url =
                clinic_object.SecondOpinion.Thumbnail.url !== null
                    ? clinic_object.SecondOpinion.Thumbnail.url
                    : null;
            return (
                <div style={{width: "100%"}}>
                    <Row className="mt-3">
                        <Col
                            className="text-center justify-content-center"
                            onClick={this.playerSelect.bind(this, "play1")}
                        >
                            <div style={video_opacity1}>
                                <img
                                    src={view_check}
                                    alt="video view check"
                                    style={video_view_check1}
                                    className="view_check"
                                    width="25px"
                                />
                                <Player
                                    className="firstVideo"
                                    playsInline
                                    ref={player1 => {
                                        this.player1 = player1;
                                    }}
                                    autoPlay={false}
                                    poster={first_thumbnail_url}
                                    src={first_video_url}
                                >
                                    <ControlBar className="my-class"/>
                                    <BigPlayButton className="big_play_btn" position="center"/>
                                </Player>
                            </div>
                            {
                                this.state.answeredAlready ? '' : (
                                    <Button
                                        type="button"
                                        className="mx-auto mt-3 bg-orange"
                                        variant="orange"
                                        onClick={this.makeRead.bind(this, 1)}
                                    >
                                        {t("utility.make_read")}
                                    </Button>
                                )
                            }
                        </Col>
                        <Col
                            className="text-center justify-content-center"
                            onClick={this.playerSelect.bind(this, "play2")}
                        >
                            <div style={video_opacity2}>
                                <img
                                    src={view_check}
                                    alt="video view check"
                                    style={video_view_check2}
                                    className="view_check"
                                    width="25px"
                                />
                                <Player
                                    className="secondVideo"
                                    playsInline
                                    ref={player2 => {
                                        this.player2 = player2;
                                    }}
                                    autoPlay={false}
                                    poster={second_thumbnail_url}
                                    src={second_video_url}
                                >
                                    <ControlBar className="my-class"/>
                                    <BigPlayButton className="big_play_btn" position="center"/>
                                </Player>
                            </div>
                            {
                                this.state.answeredAlready ? '' : (
                                    <Button
                                        type="button"
                                        className="mt-3  bg-orange"
                                        variant="orange"
                                        onClick={this.makeRead.bind(this, 2)}
                                    >
                                        {t("utility.make_read")}
                                    </Button>
                                )
                            }
                        </Col>
                    </Row>
                </div>
            );
        }
    };

    viewAnswer = () => {
        this.setState({
            answer_view: true
        })
    }

    endAnswerView = () => {
        this.setState({
            answer_view: null,
            question_index: 0
        })
    }

    showQuestion = () => {
        // this.setState({
        //     question_index: index
        // });
        const {t} = this.props;

        if (this.state.makeRead[1] === 1 && this.state.makeRead[2] === 2) {
            if (this.state.submitState === 0) {
                if (this.state.clinic_data !== "") {
                    let clinic_object = JSON.parse(this.state.clinic_data);
                    let question_amount = clinic_object.Questions.length - 1;
                    return (
                        <div
                            className="d-flex flex-column question_answer_content"
                            style={{width: "100%", minHeight: "500px"}}
                        >
                            <Row className="d-flex flex-column ml-1 mr-1 mt-2 question_content">
                                <h5 className="pl-2 pr-2">
                                    {"Question #" + (this.state.question_index + 1)}
                                </h5>
                                <p className="pl-2 pr-2">
                                    {clinic_object.Questions[this.state.question_index].Question}
                                </p>
                            </Row>
                            <Row
                                className="d-flex flex-column flex-nowrap ml-1 mr-1 mt-2 answer_content"
                            >
                                {clinic_object.Questions[this.state.question_index].options.map(
                                    (res, index) => {
                                        return (
                                            <Row
                                                className={
                                                    "answer_row mt-1 mb-1 p-2 ml-2 mr-2 d-flex align-items-center " +
                                                    (this.state.selectedAnswerIndex === index
                                                        ? "selected"
                                                        : "")
                                                }
                                                key={res.id}
                                                onClick={this.selectAnswer.bind(this, index, res.id)}
                                            >
                                                <Col className="pl-1 pr-1 text-bold">{res.Title}</Col>
                                            </Row>
                                        );
                                    }
                                )}
                            </Row>
                            <Row
                                className="mt-1 mb-1 p-2 ml-0 mr-0 train_btn"       
                                // style={{position: "absolute", bottom: "-1%", width: "90%", left: "50%", transform: "translateX(-50%)"}}                         
                            >
                                <Col className="p-0">
                                    <Button
                                        type="button"
                                        className="bg-orange pt-1 pb-1 btn-expand"
                                        variant="orange"
                                        disabled={this.state.selectedAnswerIndex !== -1 ? false : true}
                                        onClick={
                                            this.state.question_index < question_amount
                                                ? this.nextQuestion.bind(
                                                this,
                                                this.state.question_index + 1
                                                )
                                                : this.submitAnswer
                                        }
                                    >
                                        {this.state.question_index < question_amount
                                            ? "Next Question"
                                            : "Submit Answer"}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    );
                }
            } else if (this.state.submitState === 1) {
                return (
                    <div className="pl-2 pr-2 pt-5 mt-5">
                        <Loader
                            type="ThreeDots"
                            color="#09a3a1"
                            height={100}
                            width={100}
                            timeout={3000} //3 secs
                        />
                    </div>
                );
            } else if (this.state.submitState === 2) {
                let text_class = this.state.isPassed ? "text-green" : "text-danger";
                let retryButton = "";
                // if (!this.state.isPassed) {
                //   retryButton = (
                //     <Button
                //       type="button"
                //       className="bg-orange train_exam_button"
                //       onClick={this.examTryAgain}
                //     >
                //       {" "}
                //       {t("clinic.train_exam_try")}{" "}
                //     </Button>
                //   );
                // }
                return (
                    <div className="pl-2 pr-2 pt-5 mt-5">
                        <p className={ "train_exam_result text-center text-green text-bold pl-0 pr-2 mt-5 " } >
                            Thank you<br/>
                            for your answers,
                            {/* {this.state.isPassed
                ? t("clinic.train_exam_success")
                : t("clinic.train_exam_fail")} */}
                        </p>
                        <p className={"text-center text-green text-bold pl-2 pr-2 mt-0 pt-0 "}>
                            Stay tuned for the next visits
                        </p>
                        {/* {this.state.showDetailFlag ? (
              <p
                className={
                  "text-left text-bold pl-2 pr-2 mt-0 pt-0 " + text_class
                }
              >
                {this.state.isPassed
                  ? "You have passed with " + this.state.score + "%"
                  : "your grade is " +
                    this.state.score +
                    "% you can try again anytime"}
              </p>
            ) : (
              <p
                className={
                  "text-center text-bold pl-2 pr-2 mt-0 pt-0 " + text_class
                }
                style={{ fontSize: "18px" }}
              >
                {this.state.isPassed
                  ? "You have passed with " + this.state.score + "%"
                  : "your grade is " +
                    this.state.score +
                    "% you can try again anytime"}
              </p>
            )} */}
                        <div
                            className="justify-content-center d-flex align-items-end"
                            style={{height: "42vh"}}
                        >
                            {retryButton}
                        </div>
                    </div>
                );
            }
        } else {
            if (this.state.answeredAlready) {
                let clinic_object = JSON.parse(this.state.clinic_data);
                let question_amount = clinic_object.Questions.length - 1;

                if(!this.state.answer_view) {
                    return (
                        <div className="pl-2 pr-2 pt-0 mt-4 question_answer_content">
                            <h2 className="text-center text-bold text-green pl-2 pr-2 mt-4 mb-2">
                                {t("clinic.answered.title")}
                            </h2>
                            <p className="text-left text-green text-bold pt-3 pl-5 pr-5 text-center">{t("clinic.answered.content1")}</p>
                            <p className="text-left text-green text-bold pt-4 pl-5 pr-5 text-center">{t("clinic.answered.content2")}</p>
                            <Row
                                className="mt-1 mb-1 p-2 ml-0 mr-0 train_btn"
                                // style={{position: "absolute", bottom: "-1%", width: "90%", left: "50%", transform: "translateX(-50%)"}}
                            >
                                <Col className="p-0">
                                    <Button
                                        type="button"
                                        className="bg-orange pt-1 pb-1 btn-expand"
                                        variant="orange"                                        
                                        onClick={ this.viewAnswer.bind( this, this.state.question_index + 1)}
                                    >
                                        View My Answers
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                else {
                    return (
                        <div className="pl-2 pr-2 pt-0 mt-4 question_answer_content" style={{width: '100%'}}>
                            <Row className="d-flex flex-column ml-1 mr-1 mt-3 question_content">
                                <h5 className="pl-2 pr-2">
                                    {"Question #" + (this.state.question_index + 1)}
                                </h5>
                                <p className="pl-2 pr-2">
                                    {clinic_object.Questions[this.state.question_index].Question}
                                </p>
                            </Row>
                            <Row
                                className="d-flex flex-column flex-nowrap ml-1 mr-1 mt-2 answer_content"
                            >
                                {clinic_object.Questions[this.state.question_index].options.map(
                                    (res, index) => {
                                        return (
                                            <Row
                                                className={
                                                    "answer_row mt-1 mb-1 p-2 ml-2 mr-2 d-flex align-items-center " +
                                                    (clinic_object.answers[clinic_object.Questions[this.state.question_index].id] === index
                                                        ? "selected"
                                                        : "")
                                                }
                                                key={res.id}
                                            >
                                                <Col className="pl-1 pr-1 text-bold">{res.Title}</Col>
                                            </Row>
                                        );
                                    }
                                )}
                            </Row>
                            <Row
                                className="mt-1 mb-1 p-2 ml-0 mr-0 train_btn"
                                // style={{position: "absolute", bottom: "-1%", width: "90%", left: "50%", transform: "translateX(-50%)"}}
                            >
                                <Col className="p-0">
                                    <Button
                                        type="button"
                                        className="bg-orange pt-1 pb-1 btn-expand"
                                        variant="orange"
                                        onClick={
                                            this.state.question_index < question_amount
                                                ? this.nextQuestion.bind(
                                                this,
                                                this.state.question_index + 1
                                                )
                                                : this.endAnswerView
                                        }
                                    >
                                        {this.state.question_index < question_amount
                                            ? "Next Answer"
                                            : "End Answer View"}

                                    </Button>
                                </Col>
                            </Row>

                        </div>
                    );
                }
            } else if (!this.state.answeredAlready && this.state.answeredAlready != null) {
                return (
                    <div className="pl-2 pr-2 pt-5 mt-5">
                        <h5 className="text-left text-bold text-danger pl-2 pr-2 mt-5 text-center">
                            {t("clinic.warning.title")}
                        </h5>
                        <p className="text-left pl-2 pr-2 text-center">{t("clinic.warning.content")}</p>
                    </div>
                );
            }
        }
    };

    showExamQuestion = () => {
        const {t} = this.props;
        if (this.state.startExam === 1) {
            if (this.state.submitState === 0) {
                if (this.state.exam_question !== "") {
                    let exam_question = this.state.exam_question;
                    let question_amount = exam_question.Questions.length - 1;
                    return (
                        <div
                            className="row d-flex flex-column ml-0 mr-0"
                            style={{width: "100%", minHeight: "500px"}}
                        >
                            <Row className="d-flex flex-column ml-1 mr-1 mt-4">
                                <h5 className="pl-2 pr-2">
                                    {"Question #" + (this.state.question_index + 1)}
                                </h5>
                                <p className="pl-2 pr-2">
                                    {exam_question.Questions[this.state.question_index].Question}
                                </p>
                            </Row>
                            <Row
                                className="d-flex flex-column ml-1 mr-1"
                                style={{height: "50%"}}
                            >
                                {exam_question.Questions[this.state.question_index].options.map(
                                    (res, index) => {
                                        return (
                                            <Row
                                                className={
                                                    "answer_row mt-1 mb-1 p-2 ml-1 mr-1 d-flex align-items-center " +
                                                    (this.state.selectedAnswerIndex === index
                                                        ? "selected"
                                                        : "")
                                                }
                                                key={res.id}
                                                onClick={this.selectAnswer.bind(this, index, res.id)}
                                            >
                                                <Col className="pl-1 pr-1 text-bold">{res.Title}</Col>
                                            </Row>
                                        );
                                    }
                                )}
                            </Row>
                            <Row
                                className="mt-1 mb-1 p-2 ml-0 mr-0"
                                style={{position: "absolute", bottom: "10px", width: "90%"}}
                            >
                                <Col className="p-0">
                                    <Button
                                        type="button"
                                        className="bg-orange pt-1 pb-1 btn-expand"
                                        variant="orange"
                                        onClick={
                                            this.state.question_index < question_amount
                                                ? this.nextQuestion.bind(
                                                this,
                                                this.state.question_index + 1
                                                )
                                                : this.submitAnswer
                                        }
                                    >
                                        {this.state.question_index < question_amount
                                            ? "Next Question"
                                            : "Submit Answer"}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    );
                }
            } else if (this.state.submitState === 1) {
                return (
                    <div className="pl-2 pr-2 pt-5 mt-5">
                        <Loader
                            type="ThreeDots"
                            color="#09a3a1"
                            height={100}
                            width={100}
                            timeout={3000} //3 secs
                        />
                    </div>
                );
            } else if (this.state.submitState === 2) {
                let text_class = this.state.isPassed ? "text-green" : "text-danger";
                let retryButton = "";
                if (!this.state.isPassed) {
                    retryButton = (
                        <Button
                            type="button"
                            className="bg-orange train_exam_button"
                            onClick={this.examTryAgain}
                        >
                            {" "}
                            {t("clinic.train_exam_try")}{" "}
                        </Button>
                    );
                }
                return (
                    <div className="pl-2 pr-2 pt-5 mt-5">
                        <p
                            className={
                                "train_exam_result text-center text-bold pl-0 pr-2 mt-5 " +
                                text_class
                            }
                        >
                            {this.state.isPassed
                                ? t("clinic.train_exam_success")
                                : t("clinic.train_exam_fail")}
                        </p>
                        {this.state.showDetailFlag ? (
                            <p
                                className={
                                    "text-left text-bold pl-2 pr-2 mt-0 pt-0 " + text_class
                                }
                            >
                                {this.state.isPassed
                                    ? "You have passed with " + this.state.score + "%"
                                    : "your grade is " +
                                    this.state.score +
                                    "% you can try again anytime"}
                            </p>
                        ) : (
                            <p
                                className={
                                    "text-center text-bold pl-2 pr-2 mt-0 pt-0 " + text_class
                                }
                                style={{fontSize: "18px"}}
                            >
                                {this.state.isPassed
                                    ? "You have passed with " + this.state.score + "%"
                                    : "your grade is " +
                                    this.state.score +
                                    "% you can try again anytime"}
                            </p>
                        )}
                        <div
                            className="justify-content-center d-flex align-items-end"
                            style={{height: "42vh"}}
                        >
                            {retryButton}
                        </div>
                    </div>
                );
            }
        }
    };

    trainTabChange = index => {
        answer = {};
        this.setState(
            {
                trainTab: index,
                submitState: 0,
                index_1: 0,
                index_2: 0,
                play_state: 0,
                selected_player_id: 1,
                makeRead: [0, 0, 0],
                selectedAnswerID: 0,
                selectedAnswerIndex: -1,
                question_index: 0
            },
            function () {
                if (index === 1) {
                    this.setState(
                        {
                            startExam: 0,
                            selectedQusetionID: JSON.parse(this.state.clinic_data)
                                .Questions[0].id
                        },
                        function () {
                            answer = {
                                [this.state.selectedQusetionID]: 0
                            };
                        }
                    );
                }
            }
        );
    };

    examContent = () => {
        const {t} = this.props;
        return (
            <div
                className="d-flex flex-column justify-content-between"
                style={{widht: "100%", height: "40vh"}}
            >
                <div className=" pr-3 pl-3 pt-4">
                    <h5>{this.state.exam_question.Title}</h5>
                    <p className="mt-2">{this.state.exam_question.Description}</p>
                </div>
                <div className="row pr-3 pl-3 justify-content-center">
                    <Button
                        type="button"
                        className={"bg-orange train_exam_start_btn"}
                        variant="orange"
                        onClick={this.startExam}
                    >
                        {t("clinic.train_exam_start")}
                    </Button>
                </div>
            </div>
        );
    };

    loadExam = () => {
        axios
            .get(constant.baseURL + "exams", {
                headers: {
                    Authorization: `Bearer ${this.state.jwt}`
                }
            })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        exam_question: res.data[0]
                    });
                }
            });
    };

    startExam = () => {
        let exam = this.state.exam_question;
        this.setState(
            {
                selectedAnswerID: exam.Questions[0].options[0].id,
                selectedQusetionID: exam.Questions[0].id,
                startExam: 1
            },
            function () {
                answer = {};
                answer = {
                    ...answer,
                    [this.state.selectedQusetionID]: this.state.selectedAnswerIndex
                };
            }
        );
        if (
            (this.state.width <= 1024 && this.state.width < this.state.height) ||
            (this.state.width <= 1024 && this.state.height < 910)
        ) {
            this.setState({
                show_detail_state: true
            });
        }
    };

    render() {
        const {t} = this.props;
        return (
            <div className="">
                <Container className="">
                    <Navbars/>
                    <Row>
                        <Col md={2} className="pl-0 pr-0">
                            <Sidebar active_class="home"/>
                        </Col>
                        <Col
                            md={10}
                            className="about_body d-flex flex-column justify-content-between align-content-between"
                        >
                            <Row className="ml-3">
                                <Row style={{width: "100%"}}>
                                    <Col>
                                        <h1 className="mt-3 text-bold">{t("clinic.title")}</h1>
                                    </Col>
                                </Row>
                                <Row className="mt-1 mb-1 p-0 pt-3" style={{width: "100%"}}>
                                    <Col md={this.state.showDetailFlag ? 8 : 12}>
                                        {/*<div className="train_tab mb-3 mt-1">*/}
                                        {/*    <Button type="button"*/}
                                        {/*            className={(this.state.trainTab === 1) ? 'text-bold bg-orange train_tab_btn' : 'text-bold bg-orange train_tab_btn back_opacity'}*/}
                                        {/*            variant='orange'*/}
                                        {/*            onClick={this.trainTabChange.bind(this, 1)}>{t("clinic.train_tab_btn1")}</Button>*/}
                                        {/*    <Button type="button"*/}
                                        {/*            className={(this.state.trainTab === 2) ? 'text-bold bg-orange train_tab_btn' : 'text-bold bg-orange train_tab_btn back_opacity'}*/}
                                        {/*            variant='orange'*/}
                                        {/*            onClick={this.trainTabChange.bind(this, 2)}>{t("clinic.train_tab_btn2")}</Button>*/}
                                        {/*</div>*/}
                                        <div className="train_center">
                                            <img
                                                className="fit_image"
                                                style={{height: "55px"}}
                                                src={center_image}
                                            />
                                            <span className="train_center_text">
                        {this.state.trainTab === 1
                            ? t("clinic.train_center_image_alt1")
                            : t("clinic.train_center_image_alt2")}
                                                <br/>
                                                {this.state.trainTab === 1
                                                    ? t("clinic.train_center_image_alt1_2")
                                                    : t("clinic.train_center_image_alt2_2")}
                        </span>
                                        </div>
                                        {this.state.trainTab === 1
                                            ? this.showVideoInfo()
                                            : this.examContent()}
                                    </Col>
                                    {this.state.showDetailFlag ? (
                                        <Col md={4}>
                                            <div className="profile_info question_answer pl-0 pr-0 pb-1">
                                                <Row className="pt-0">
                                                    <Col
                                                        className="d-flex justify-content-center"
                                                        // style={{height: "78vh"}}
                                                    >
                                                        {this.state.trainTab === 1
                                                            ? this.showQuestion()
                                                            : this.showExamQuestion()}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    ) : (
                                        ""
                                    )}
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Modal
                    show={this.state.show_detail_state}
                    onHide={this.handleDetailClose}
                    className="showSpeakerDetail"
                >
                    <Modal.Body>
                        {(this.state.answeredAlready) ?
                            <div className="pl-2 pr-2 pt-5 mt-2">
                            <h2 className="text-center text-bold text-green pl-2 pr-2 mt-5 mb-2">
                            {t("clinic.answered.title")}
                            </h2>
                            <p className="text-left text-green text-bold pt-3 pl-5 pr-5 text-center">{t("clinic.answered.content1")}</p>
                            <p className="text-left text-green text-bold pt-4 pl-5 pr-5 text-center">{t("clinic.answered.content2")}</p>
                            </div>
                         :
                        this.state.trainTab === 1
                            ? this.showQuestion()
                            : this.showExamQuestion()
                        }
                    </Modal.Body>
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

export default withTranslation()(Train);
