// LeaveDetails.jsx
import React, { useEffect, useState } from 'react';
import { Table, Spin, Tag, Button, message, Input } from 'antd';
import { debounce } from 'lodash';
import axios from 'axios';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import BackToHome from '../components/BackToHome';
import Header from '../components/Header';
import { useRef } from 'react';
import { getAllLeaves, updateLeaveStatus } from '../utils/apiCalls';

const LeaveDetails = () => {
    const [myLeaves, setMyLeaves] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const location = useLocation();
    const show = location.state?.show || "both"; // fallback to both

    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useRef(
        debounce((query) => {
            fetchLeaves(query);
        }, 500)
    ).current;

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };


    const fetchLeaves = async (search = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await getAllLeaves({ search });
            // console.log(res.config.url);
            setMyLeaves(res.data.myLeaves);
            if (user.role === "manager") {
                setPendingLeaves(res.data.pendingLeaves);
            }
        } catch (err) {
            console.error('Error fetching leaves:', err);
        } finally {
            setLoading(false);
        }
    };

    // const fetchLeaves = async () => {
    //     setLoading(true);
    //     try {
    //         const token = localStorage.getItem('token');
    //         const res = await axios.get('http://localhost:5000/api/leaves/getleaves', {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setMyLeaves(res.data.myLeaves);
    //         if (user.role === "manager") {
    //             setPendingLeaves(res.data.pendingLeaves);
    //         }
    //     } catch (err) {
    //         console.error('Error fetching leave details:', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleDecision = async (leaveId, status) => {
        try {
            await updateLeaveStatus(leaveId, status);
            message.success(`Leave ${status.toLowerCase()} successfully!`);
            fetchLeaves(); // Refresh data
        } catch (err) {
            console.error('Error updating leave:', err);
            message.error(`Failed to ${status.toLowerCase()} leave`);
        }
    };

    const commonColumns = [
        { title: 'Employee', dataIndex: 'name', key: 'name' },
        { title: 'Reason', dataIndex: 'reason', key: 'reason' },
        {
            title: 'From',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: date => new Date(date).toLocaleDateString(),
        },
        {
            title: 'To',
            dataIndex: 'toDate',
            key: 'toDate',
            render: date => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Applied On',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: (date) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                switch (status) {
                    case 'Pending':
                        color = 'processing';
                        break;
                    case 'Approved':
                        color = 'green';
                        break;
                    case 'Rejected':
                        color = 'red';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];

    const actionColumn = {
        title: 'Action',
        render: (_, record) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => handleDecision(record._id, 'Approved')}
                >
                    Approve
                </Button>
                <Button
                    danger
                    size="small"
                    onClick={() => handleDecision(record._id, 'Rejected')}
                >
                    Reject
                </Button>
            </div>
        ),
    };

    return (
        <>
            <Header />
            <div style={{ padding: 24 }}>
                <div style={{ marginBlock: 16 }}>
                    <BackToHome path="/dashboard" btntext=" Go to Dashboard" />
                </div>
                <h2 style={{ marginBlock: 6 }}>Leave Details</h2>
                {/* {loading ? (
                    <Spin />
                ) : ( */}

                <>

                    {(show === 'myLeaves' || show === 'both') && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h3>My Leave Applications</h3>
                                <Input
                                    placeholder="Search by name, reason, type, status..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    style={{ marginBottom: 16, width: 300 }}
                                />
                            </div>

                            <Table
                                dataSource={myLeaves}
                                columns={commonColumns}
                                rowKey="_id"
                                pagination={{ pageSize: 10 }}
                                loading={loading}
                            />
                        </>
                    )}

                    {user.role === "manager" && (show === 'pendingLeaves' || show === 'both') && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>

                                <h3>All Pending Leave Requests</h3>
                                <Input
                                    placeholder="Search by name, reason, type, status..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    style={{ marginBottom: 16, width: 300 }}
                                />
                            </div>

                            <Table
                                dataSource={pendingLeaves}
                                columns={[...commonColumns, actionColumn]}
                                rowKey="_id"
                                pagination={{ pageSize: 10 }}
                                loading={loading}
                            />
                        </>
                    )}
                </>
                {/* )} */}
            </div>
        </>
    );
};

export default LeaveDetails;
