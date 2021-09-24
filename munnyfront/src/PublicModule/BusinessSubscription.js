import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../CommonFiles/Footer";
import Header from "../CommonFiles/Header";
export default function BusinessSubscription(props) {
  const [monthlyList, setMonthlyList] = useState([]);
  const [yearlyList, setYearlyList] = useState([]);
  const [monthlyPremiumList, setMonthlyPremiumList] = useState([]);
  const [yearlyPremiumList, setYearlyPremiumList] = useState([]);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [monthlyPremiumPrice, setMonthlyPremiumPrice] = useState(0);
  const [yearlyPremiumPrice, setYearlyPremiumPrice] = useState(0);
  useEffect(() => {
    getMonthlyData();
    getYearlyData();
    getMonthlyPremiumData();
    getYearlyPremiumData();
  }, []);
  function getMonthlyData() {
    applicationAPI()
      .fetchMonthly()
      .then(
        (res) => (
          setMonthlyList(res.data),
          setMonthlyPrice(res.data[0].subscriptionType.price)
        )
      )
      .catch((err) => console.log(err));
  }
  function getYearlyData() {
    applicationAPI()
      .fetchYearly()
      .then(
        (res) => (
          setYearlyList(res.data),
          setYearlyPrice(res.data[0].subscriptionType.price)
        )
      )
      .catch((err) => console.log(err));
  }
  function getMonthlyPremiumData() {
    applicationAPI()
      .fetchYearly()
      .then(
        (res) => (
          setMonthlyPremiumList(res.data),
          setMonthlyPremiumPrice(res.data[0].subscriptionType.price)
        )
      )
      .catch((err) => console.log(err));
  }
  function getYearlyPremiumData() {
    applicationAPI()
      .fetchYearly()
      .then(
        (res) => (
          setYearlyPremiumList(res.data),
          setYearlyPremiumPrice(res.data[0].subscriptionType.price)
        )
      )
      .catch((err) => console.log(err));
  }
  const applicationAPI = (
    url = "https://localhost:44368/api/subscriptiondata/"
  ) => {
    return {
      fetchMonthly: () => axios.get(url + "GetBySubsctionType/1"),
      fetchYearly: () => axios.get(url + "GetBySubsctionType/2"),
    };
  };
  const BasicYearlyPayment = (e) => {    
    e.preventDefault();
    window.location.replace('https://ravesandbox.flutterwave.com/pay/basicyearly')
  };
  const  BasicMonthlyPayment= (e) => {    
    e.preventDefault();
    window.location.replace('https://ravesandbox.flutterwave.com/pay/basicmonthly')
  };
  return (
    <div>
      <div id="main-wrapper">
        <Header></Header>
        <div id="content">
          <div className="container">
            <div className="bg-light shadow-md rounded p-4">
              <div className="row">
                <div className="col-lg-12">
                  <h2 style={{ color: "#000" }}>
                    Find the MunnyFinds plan that’s right for you
                  </h2>
                  <br />
                  <br />
                </div>
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContentVertical">
                    <div
                      className="tab-pane fade show active"
                      id="oneTab"
                      role="tabpanel"
                      aria-labelledby="one-tab"
                    >
                      <div className="row">
                        <div className="col-sm-3 mb-4">
                          <div className="card text-center">
                            <div className="card-header">
                              <h5 className="card-title text-4 mb-0">
                                Monthly Plan
                              </h5>
                            </div>
                            <div className="card-body">
                              <ul className="list-unstyled">
                                {monthlyList.map((monthly) => (
                                  <li className="mb-3">
                                    {monthly.subscriptionText}
                                  </li>
                                ))}
                              </ul>
                             <button
                                className="btn btn-sm btn-block btn-outline-primary text-5 py-1 font-weight-500 shadow-none"
                                type="submit"
                                onClick={(e) =>
                                  BasicMonthlyPayment(e)
                                }
                              >
                                NGN {monthlyPrice}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                          <div className="card text-center">
                            <div className="card-header">
                              <h5 className="card-title text-4 mb-0">
                                Yearly Plan
                              </h5>
                            </div>
                            <div className="card-body">
                              <ul className="list-unstyled">
                                {yearlyList.map((yearly) => (
                                  <li className="mb-3">
                                    {yearly.subscriptionText}
                                  </li>
                                ))}
                              </ul>
                             <button
                                className="btn btn-sm btn-block btn-outline-primary text-5 py-1 font-weight-500 shadow-none"
                                type="submit"
                                onClick={(e) =>
                                  BasicYearlyPayment(e)
                                }
                              >
                                NGN {yearlyPrice}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                          <div className="card text-center">
                            <div className="card-header">
                              <h5 className="card-title text-4 mb-0">
                                Premium Monthly Plan
                              </h5>
                            </div>
                            <div className="card-body">
                              <ul className="list-unstyled">
                                {monthlyPremiumList.map((yearly) => (
                                  <li className="mb-3">
                                    {yearly.subscriptionText}
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="btn btn-sm btn-block btn-outline-primary text-5 py-1 font-weight-500 shadow-none"
                                type="submit"
                                onClick={(e) =>
                                  BasicMonthlyPayment(e)
                                }
                              >
                                NGN {monthlyPremiumPrice}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                          <div className="card text-center">
                            <div className="card-header">
                              <h5 className="card-title text-4 mb-0">
                                Premium Yearly Plan
                              </h5>
                            </div>
                            <div className="card-body">
                              <ul className="list-unstyled">
                                {yearlyPremiumList.map((yearly) => (
                                  <li className="mb-3">
                                    {yearly.subscriptionText}
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="btn btn-sm btn-block btn-outline-primary text-5 py-1 font-weight-500 shadow-none"
                                type="submit"
                                onClick={(e) =>
                                  BasicMonthlyPayment(e)
                                }
                              >
                                NGN {yearlyPremiumPrice}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
