import React from "react";
// react-bootstrap components
import { Button, Card, Container, Row, Col, Modal } from "react-bootstrap";
import './TableList.css';
import Maps from "./Maps";
import ReactFancyBox from "react-fancybox";
import "react-fancybox/lib/fancybox.css";
import example_response from "data/example_response_js_file";
import RowItem from "../components/RowItem";
import Loading from "../components/Loading";
import errorLogo from "../assets/img/error.png";
import successLogo from "../assets/img/success.png";
import {
  ModalButton,
  DisabledButton,
  ErrorBody,
  ModalAlertHeader,
  EventHeader,
  MD8,
} from "../styledComponents/styledComponents";
import { formatDate } from "../helper/helper";

class TableList extends React.Component {
  state = {
    list: [],
    fulllist: [],
    activeTab: "detail",
    activeTabModal: "selectaction",
    currentItem: {},
    show: false,
    sortKey: "date",
    sortType: 0,
    selectedAction: "",
    detail: "",
    showLoading: false,
    showError: false,
    showSuccess: false,
  };
  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };
  setActiveTabModal = (activeTabModal) => {
    this.setState({ activeTabModal });
  };
  setItem = (currentItem) => {
    // debugger;
    this.setState({ currentItem });
  };
  setShow = (show) => {
    this.setState({ show });
  };
  setShowLoading = (showLoading) => {
    this.setState({
      showLoading,
      show: false,
      showError: false,
      showSuccess: false,
    });
    setTimeout(() => {
      this.setState({
        showLoading: false,
        showError: this.state.detail.length < 1,
        showSuccess: this.state.detail.length > 0,
        activeTabModal: "selectaction",
      });

      if (this.state.detail.length > 0) {
        this.state.currentItem.active =
          this.state.selectedAction == "mark"
            ? "Mark As Reseolved"
            : "Change Asset";
        this.setState({ currentItem: this.state.currentItem });
      }
    }, 1000);
  };

  setCloseLoading = () => {
    this.setState({
      showLoading: false,
      show: false,
      showError: false,
      showSuccess: false,
      selectedAction: "",
      detail: "",
    });
  };
  setSelectedAction = (selectedAction) => {
    this.setState({ selectedAction });
  };
  setDetail = (detail) => {
    this.setState({ detail });
  };
  componentDidMount() {
    const { list } = this.state;
    example_response.data.map((item) => {
      var date = item.details.find((f) => f.title == "Tarih");
      item.date = formatDate(date.value);

      var incident_type = item.details.find((f) => f.title == "Tip");
      item.incident_type = incident_type.value;
      var active = item.details.find((f) => f.title == "Aksiyon");
      item.active = active.value;

      var q = `${item.location.latitude},${item.location.longitude}`; //localstore keyi
      //hafızada var m kontrolu
      if (localStorage.getItem(q)) {
        list.push({ ...item, ...JSON.parse(localStorage.getItem(q)) });
        this.setState({ list, fulllist: list });
      } else {
        //sunucuya istek atılması
        fetch(
          `http://api.positionstack.com/v1/reverse?access_key=3ad5893bf259801bf09527b48fc3b39a&query=${q}&limit=1`
        )
          //sonucun json nesnesine dönüştürülmes,
          .then((res) => res.json())
          .then((result) => {
            //json nesnesi üzerinde data validasyonu
            if (result?.data?.length) {
              //datanın tarayıcı belleğine kayıtı
              var adress = result.data[0].label ?? "Adress cannot be found";
              var distance = result.data[0].distance ?? "-";
              var d ={ adress, distance }
              item = { ...item, ...d };
              list.push(item);
              this.setState({ list, fulllist: list });
              localStorage.setItem(q, JSON.stringify(d));

              //ve sonucun döndürülmesi
              return result.data[0].label;
            } else {
              var d ={
                adress: "Adress cannot be found",
                distance: "-",
              }
              item = {
                ...item,
                ...d
              };
              list.push(item);
              this.setState({ list, fulllist: list });
              localStorage.setItem(q, JSON.stringify(d));
            }
          });
      }
    });
    this.sort("date");
  }

  filter = (key, value) => {
    var list = this.state.fulllist.filter((f) => `${f[key]}`.toLocaleLowerCase().match(value.toLocaleLowerCase()));
    this.setState({ list });
  };

  sort = (key) => {
    const { list, sortType } = this.state;
    var list1 = list.sort(function (a, b) {
      if (sortType) {
        if (typeof a[key] === "string" && a[key] > b[key]) return -1;
        if (typeof a[key] === "string" && a[key] < b[key]) return 1;
        else return a[key] - b[key];
      } else {
        if (typeof b[key] === "string" && b[key] > a[key]) return -1;
        if (typeof b[key] === "string" && b[key] < a[key]) return 1;
        else return b[key] - a[key];
      }
    });

    this.setState({
      list: list1,
      sortkey: key,
      sortType: sortType ? 0 : 1,
    });
  };

  sortChr(key) {
    return this.state.sortkey === key ? (this.state.sortType ? "↓" : "↑") : "";
  }

  setAction(item) {
    if (item.action_id) {
      this.setShow(true);
    } else {
      this.state.currentItem.active = item.title;
      this.setState({ currentItem: this.state.currentItem });
    }
  }
  

  render() {
    const handleClose = () => this.setShow(false);
    const handleCloseLoading = () => this.setShowLoading(false);

    const {
      list,
      activeTab,
      activeTabModal,
      currentItem,
      show,
      showLoading,
      showError,
      showSuccess,
    } = this.state;
  
    return (
      <>
        <Container fluid style={{ background: "#EBECEF", height: "100vh" }}>
          <Row>
            <MD8 className="col-md-8">
              <EventHeader>EVENTS</EventHeader>
              <table
                style={{
                  width: "100%",
                  marginTop: "10px",
                  background: `${"#ffffff"} 0% 0% no-repeat padding-box`,
                  boxShadow: "0px 3px 6px #00000014",
                  opacity: 1,
                  padding: "10px",
                  borderLeft: `10px solid ${"#ffffff"}`,
                  cursor: "pointer",
                }}
              >
                <thead className="input-headers">
                  <tr>
                    <th onClick={() => this.sort("date")}>
                      Date {this.sortChr("date")}
                    </th>
                    <th onClick={() => this.sort("incident_type")}>
                      Type {this.sortChr("incident_type")}
                    </th>
                    <th onClick={() => this.sort("id")}>
                      Bin ID {this.sortChr("id")}
                    </th>
                    <th onClick={() => this.sort("distance")}>
                      Distance(m) {this.sortChr("distance")}
                    </th>
                    <th onClick={() => this.sort("active")}>
                      Action {this.sortChr("active")}
                    </th>
                  </tr>
                </thead>
                <tbody className="input-container">
                  <tr>
                    <td>
                      <input
                        className="form-control input-item"
                        placeholder="Search by date.."
                        
                        onChange={(e) => this.filter("date", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control input-item"
                        placeholder="Search by type.."
                        onChange={(e) =>
                          this.filter("incident_type", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control input-item"
                        placeholder="Search by id.."
                        onChange={(e) => this.filter("id", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control input-item"
                        placeholder="Search by distance.."
                        onChange={(e) =>
                          this.filter("distance", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ minWidth: "235px" }}>
                      <input
                        className="form-control input-item"
                        placeholder="Search by action.."
                        onChange={(e) => this.filter("active", e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              {list.map((item) => (
                <RowItem
                  key={item.id}
                  item={item}
                  setItem={this.setItem}
                  currentItem={currentItem}
                />
              ))}
            </MD8>
            <div className="col-md-4">
              <EventHeader>EVENT DETAILS</EventHeader>
              <Card style={{ padding: 10, borderColor: "transparent" }}>
                <div className="row">
                  {currentItem.actions &&
                    currentItem.active === "-" &&
                    currentItem.actions.map((item, index) => (
                      <div className="col-md-6" style={{ marginBottom: 25 }}>                       
                        <button
                          key={index}
                          onClick={() => this.setAction(item)}
                          className={
                            "btn btn-block" +
                            (!item.action_id
                              ? " btn-primary"
                              : " btn-success") +
                            " font-link"
                          }
                          style={index===0 ? {
                            fontSize: 12,
                            backgroundColor: "#172C49",
                            borderColor: "transparent",
                            color: "white",
                            fontWeight: "bold",
                          }:  {
                            fontSize: 12,
                            backgroundColor: "#3BA935",
                            borderColor: "transparent",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {item.title.toUpperCase()}
                        </button>
                      </div>
                    ))}
                </div>
                <div
                  className="row"
                  style={{ borderBottom: "2px solid #eee", marginBottom: 10 }}
                >
                  <div
                    className="col-md-4 font-link"
                    style={{
                      fontSize: 14,
                      color: "#172C49",
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                    }}
                  >
                    <a
                      onClick={() => this.setActiveTab("detail")}
                      style={
                        activeTab == "detail"
                          ? {
                              borderBottom: "3px solid green",
                              fontWeight: "bold",
                              fontFamily: "Open Sans",
                            }
                          : {
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Open Sans",
                            }
                      }
                    >
                      DETAILS
                    </a>
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      fontSize: 14,
                      color: "#172C49",
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                    }}
                  >
                    <a
                      onClick={() => this.setActiveTab("location")}
                      style={
                        activeTab == "location"
                          ? {
                              borderBottom: "3px solid green",
                              fontWeight: "bold",
                              fontFamily: "Open Sans",
                            }
                          : {
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Open Sans",
                            }
                      }
                    >
                      LOCATION
                    </a>
                  </div>
                  <div
                    className="col-md-4"
                    style={{
                      fontSize: 14,
                      color: "#172C49",
                      fontFamily: "Open Sans",
                      fontWeight: "bold",
                    }}
                  >
                    <a
                      onClick={() => this.setActiveTab("media")}
                      style={
                        activeTab == "media"
                          ? {
                              borderBottom: "3px solid green",
                              fontWeight: "bold",
                              fontFamily: "Open Sans",
                            }
                          : {
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Open Sans",
                            }
                      }
                    >
                      MEDIA
                    </a>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {activeTab == "detail" && currentItem.details && (
                      <table
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          overflow:'hidden'
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ fontSize: 14, fontWeight: "bold" }}>
                              Driver
                            </th>
                            <th style={{ fontSize: 14, fontWeight: "bold" }}>
                             The License Plate Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                          <td style={{ fontSize: 13 }}>{currentItem.details[7].value}</td> 
                            <td style={{ fontSize: 13 }}>{currentItem.details[6].value}</td>
                            
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {activeTab == "location" && (
                      <div>
                        <table
                          style={{
                            width: "100%",
                            marginTop: "10px",
                          }}
                        >
                          <thead>
                            <tr>
                              <th style={{ fontSize: 14, fontWeight: "bold" }}>
                                Address
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ fontSize: 12 }}>
                                {currentItem.adress}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="row">
                          <div className="col-md-12">
                            {currentItem.location ? (
                              <Maps
                                lat={`${currentItem.location.latitude}`}
                                lng={`${currentItem.location.longitude}`}
                              />
                            ) : (
                              <h5 style={{ fontSize: 14 }}>
                                There is no map information
                              </h5>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab == "media" && (
                      <div style={{overflow:'hidden'}}>
                        {currentItem.media ? (
                          currentItem.media[0].type === "image" ? (
                            
                              <ReactFancyBox                              
                                thumbnail={currentItem.media[0].url}
                                image={currentItem.media[0].url}
                              />
                              
                          ) : (
                            <audio controls>
                              <source
                                src={currentItem.media[0].url}
                                type="audio/mp3"
                              />
                            </audio>
                          )
                        ) : (
                          <h5 style={{ fontSize: 14 }}>No Media Content</h5>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </Row>
        </Container>

        <Modal show={show} onHide={handleClose} size='lg'>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div
              className="row"
              style={{ borderBottom: "2px solid #eee" }}
            >
              <div className="col-md-6">
                <a
                style={
                    activeTabModal == "takeaction"
                      ? {
                          // borderBottom: "3px solid green",
                          fontWeight: "bold",
                          color: "#EBECEF",    
                          fontFamily: "Open Sans",
                        }
                      : {
                        // borderBottom: "3px solid green",
                          fontWeight: "bold",
                          color: "#172C49",
                          fontFamily: "Open Sans",
                        }
                  }
                >
                  <div className="rounded-number"><span>1</span></div>
                  <span className={activeTabModal === "takeaction" ? "" : "underline"}>SELECT ACTION</span>
                </a>
              </div>
              <div className="col-md-6">
                <a
                 style={
                  activeTabModal == "takeaction"
                    ? {
                        
                        fontWeight: "bold",
                        color: "#172C49",
                        fontFamily: "Open Sans",
                      }
                    : {
                        fontWeight: "bold",
                        color: "#EBECEF",
                        fontFamily: "Open Sans",
                      }}          
                >
                  <div className="rounded-number"><span>2</span></div> <span className={activeTabModal === "takeaction" ? "underline" : ""}>TAKE ACTION</span>
                </a>
              </div>
            </div>
            {activeTabModal == "selectaction" && (
              <div className="row">
                <ModalButton
                  onClick={() => this.setSelectedAction("mark")}
                  className="col-md-12"
                  selected={this.state.selectedAction === "mark"}
                >
                  <h5 style={{ fontWeight: "bold"}}>Mark As Reseolved</h5>
                  <span>
                    Mark this event as resolved and enter the details of the
                    resolution
                  </span>
                </ModalButton>
                <ModalButton
                  onClick={() => this.setSelectedAction("change")}
                  className="col-md-12 shadow"
                  selected={this.state.selectedAction === "change"}
                >
                  <h5 style={{ fontWeight: "bold" }}>Change Asset</h5>
                  <p>Change the asset with another one</p>
                </ModalButton>

                <Modal.Footer style={{ width: "100%" }}>
                  <DisabledButton
                    class="btn"
                    disabled={this.state.selectedAction === ""}
                    onClick={() => this.setActiveTabModal("takeaction")}
                  >
                    NEXT
                  </DisabledButton>
                </Modal.Footer>
              </div>
            )}
            {activeTabModal == "takeaction" && (
              <div className="row">
                <div
                  className="col-md-12"
                  style={{ padding: 10, width: "%100", borderRadius: 2 }}
                >
                  {this.state.selectedAction == "mark" && (
                    <div>
                      <h5 style={{ fontWeight: "bold" }}>Mark As Reseolved</h5>
                      <p>
                        Mark this event as resolved and enter the details of the
                        resolution
                      </p>
                    </div>
                  )}
                  {this.state.selectedAction == "change" && (
                    <div>
                      <h5 style={{ fontWeight: "bold" }}>Change Asset</h5>
                      <p>Change the asset with another one</p>
                    </div>
                  )}
                  <h5 style={{ fontWeight: "bold" }}>Resolution Detail*</h5>
                  <textarea
                    onChange={(e) => this.setDetail(e.target.value)}
                    maxLength={300}
                    className="form-control"
                    rows="5"
                    placeholder="Enter resolution detail..."
                  ></textarea>
                  <p className="textarea-footer">({this.state.detail.length} / 300)</p>

                  <Modal.Footer style={{ width: "100%" }}>
                    <Button
                    className="dark-button"
                      variant="dark"
                      onClick={() => this.setActiveTabModal("selectaction")}
                    >
                      BACK
                    </Button>
                    <Button
                    className="green-button"
                      style={{ marginLeft: "10px" }}
                      variant="success"
                      onClick={() => this.setShowLoading(true)}
                    >
                      TAKE ACTION
                    </Button>
                  </Modal.Footer>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
        <Modal show={showLoading} onHide={this.setCloseLoading}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ padding: 40 }}>
            <Loading />
          </Modal.Body>
        </Modal>
        <Modal show={showError} onHide={this.setCloseLoading}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ padding: 40 }}>
            <img
              src={errorLogo}
              style={{ margin: "0 auto", display: "block" }}
            />
            <ModalAlertHeader>A PROBLEM OCCURED!</ModalAlertHeader>
            <ErrorBody>
              We cannot continue due to a problem. Please try again later.
            </ErrorBody>
          </Modal.Body>
        </Modal>
        <Modal show={showSuccess} onHide={this.setCloseLoading}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ padding: 40 }}>
            <img
              src={successLogo}
              style={{ margin: "0 auto", display: "block", width:'auto' }}
            />
            <ModalAlertHeader success>ACTION HAS BEEN TAKEN!</ModalAlertHeader>
            <ErrorBody>
              You can see the action details from details tab.
            </ErrorBody>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default TableList;
