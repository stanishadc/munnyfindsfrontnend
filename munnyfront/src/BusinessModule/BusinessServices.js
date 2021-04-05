import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../CommonFiles/Footer';
import Header from '../CommonFiles/Header';
import BusinessSidebar from './BusinessSidebar';
import { handleSuccess, handleError } from "../CommonFiles/CustomAlerts";
const initialFieldValues = {
    serviceId: 0,
    serviceName: "",
    description: "",
    businessId: "",
    categoryId: "0",
    duration: "",
    price: 0,
    status: "true",
    createdDate: new Date().toLocaleString(),
    updatedDate: new Date().toLocaleString(),
}
export default function BusinessServices(props) {
    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [servicesList, setServicesList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null)
    useEffect(() => {
        if (recordForEdit !== null)
            setValues(recordForEdit);
    }, [recordForEdit])
    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }
    const validate = () => {
        let temp = {}
        temp.serviceName = values.serviceName === "" ? false : true;
        temp.categoryId = values.categoryId === "0" ? false : true;
        setErrors(temp)
        return Object.values(temp).every(x => x === true)
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            const formData = new FormData()
            formData.append('serviceId', values.serviceId)
            formData.append('serviceName', values.serviceName)
            formData.append('categoryId', values.categoryId)
            formData.append('description', values.description)
            formData.append('duration', values.duration)
            formData.append('price', values.price)
            formData.append('businessId', localStorage.getItem('MFFBusinessId'))
            formData.append('createdDate', values.createdDate)
            formData.append('updatedDate', values.updatedDate)
            formData.append('status', values.status)
            console.log(values)
            addOrEdit(formData, resetForm)
        }
    }
    const applicationAPI = (url = 'https://munnyfindsapi.azurewebsites.net/api/service/') => {
        return {
            fetchAll: () => axios.get(url + 'GetByBusinessId/'+localStorage.getItem('MFFBusinessId')),
            create: newRecord => axios.post(url + "insert", newRecord),
            update: (id, updateRecord) => axios.put(url + "update/" + id, updateRecord),
            delete: id => axios.delete(url + "delete/" + id),
            fetchCategory: () => axios.get('https://munnyfindsapi.azurewebsites.net/api/category/get'),
        }
    }
    const showEditDetails = data => {
        setRecordForEdit(data)
    }
    const onDelete = (e, id) => {
        if (window.confirm('Are you sure to delete this record?'))
            applicationAPI().delete(id)
                .then(res => {
                    handleSuccess("Service Deleted Succesfully");
                    refreshServicesList()
                })
                .catch(err => handleError("Service Deleted Failed"))
    }
    const addOrEdit = (formData, onSuccess) => {
        if (formData.get("serviceId") === "0") {
            applicationAPI()
                .create(formData)
                .then((res) => {
                    handleSuccess("New Service Added");
                    resetForm();
                    refreshServicesList();
                });
        } else {
            applicationAPI()
                .update(formData.get("serviceId"), formData)
                .then((res) => {
                    handleSuccess("Service Details Updated");
                    resetForm();
                    refreshServicesList();
                });
        }
    };
    const resetForm = () => {
        setValues(initialFieldValues)
    }
    const applyErrorClass = field => ((field in errors && errors[field] === false) ? ' form-control-danger' : '')
    function refreshCategoryList() {
        applicationAPI().fetchCategory()
            .then(res => setCategoryList(res.data))
            .catch(err => console.log(err))
    }
    function refreshServicesList() {
        applicationAPI().fetchAll()
            .then(res => setServicesList(res.data))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        refreshCategoryList();
        refreshServicesList();
    }, [])
    return (
        <div id="main-wrapper">
            <Header></Header>
            <section className="page-header page-header-text-light bg-secondary">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1>Business Profile</h1>
                        </div>
                        <div className="col-md-4">
                            <ul className="breadcrumb justify-content-start justify-content-md-end mb-0">
                                <li><Link to={"/"}>Home</Link></li>
                                <li className="active">Business Services</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>{/* Page Header end */}
            <div id="content">
                <div className="container">
                    <div className="row">
                        <BusinessSidebar></BusinessSidebar>
                        <div className="col-lg-9">
                            <div className="bg-white shadow-md rounded p-4">
                                <h5 className="mb-4">Business Profile</h5>
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item"> <Link to={"/business/businessprofile"} className="nav-link" id="upcoming" data-toggle="tab" href="#upcoming" role="tab" aria-controls="upcoming" aria-selected="true">Profile</Link> </li>
                                    <li className="nav-item"> <Link to={"/business/services"} className="nav-link active" id="completed" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Services</Link> </li>
                                    <li className="nav-item"> <Link to={"/business/availability"} className="nav-link" id="cancelled" data-toggle="tab" href="#cancelled" role="tab" aria-controls="cancelled" aria-selected="false">Availability</Link> </li>
                                </ul>
                                <div className="tab-content my-3" id="myTabContent">
                                    <div className="tab-pane show active">
                                        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                            <div className="form-group row">
                                                <div class="col-lg-6">
                                                    <label htmlFor="categoryId">Category</label>
                                                    <select className={"form-control" + applyErrorClass('categoryId')} value={values.categoryId} name="categoryId" onChange={handleInputChange}>
                                                        <option value="0">Select Category</option>
                                                        {categoryList.map(data =>
                                                            <option value={data.categoryId}>{data.categoryName}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div class="col-lg-6">
                                                    <label htmlFor="serviceName">Service Name</label>
                                                    <input className={"form-control" + applyErrorClass('serviceName')} name="serviceName" type="text" value={values.serviceName} onChange={handleInputChange} placeholder="Business Name" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div class="col-lg-6">
                                                    <label htmlFor="duration">Duration</label>
                                                    <select className={"form-control" + applyErrorClass('duration')} value={values.duration} name="duration" onChange={handleInputChange}>
                                                        <option value="0">Select Duration</option>
                                                        <option value="30">30 mins</option>
                                                        <option value="60">1 Hour</option>
                                                        <option value="90">1 Hour 30 mins</option>
                                                        <option value="120">2 Hours</option>
                                                    </select>
                                                </div>
                                                <div class="col-lg-6">
                                                    <label htmlFor="price">Price</label>
                                                    <input className={"form-control" + applyErrorClass('price')} name="price" type="text" value={values.price} onChange={handleInputChange} placeholder="price" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div class="col-lg-12">
                                                    <label htmlFor="description">Description</label>
                                                    <input className={"form-control" + applyErrorClass('description')} name="description" type="text" value={values.description} onChange={handleInputChange} placeholder="Please Enter Service Details" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div class="col-lg-7">
                                                </div>
                                                <div class="col-lg-5">
                                                    <button className="btn btn-primary mr-2" type="submit">Submit</button>
                                                    <button className="btn btn-warning" type="button" onClick={resetForm}>Cancel</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="table-responsive product-list">
                                <table className="table table-bordered table-striped mt-3" id="categoryList">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Service Name</th>
                                            <th>Duration</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {servicesList.map(service =>
                                            <tr key={service.serviceId}>
                                                <td>{service.serviceName}</td>
                                                <td>{service.category.categoryName}</td>
                                                <td>{service.duration}</td>
                                                <td>{service.price}</td>
                                                <td>
                                                    <button className="btn btn-success mr-2" onClick={() => { showEditDetails(service) }}><i className="fa fa-pencil" /></button>
                                                    <button className="btn btn-danger" onClick={e => onDelete(e, parseInt(service.serviceId))}><i className="fas fa-trash" /></button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}