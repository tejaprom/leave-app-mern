import React, { useEffect, useRef, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, DatePicker, message, Tag } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '../utils/showToast';
import Header from '../components/Header';
// import { API_BASE_URL } from '../utils/axiosConfig';
import { applyLeave, getAllLeaves, updateLeaveStatus } from '../utils/apiCalls';
import { API_BASE_URL } from '../utils/constants';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // const [leaves, setLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [allLeaves, setAllLeaves] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();

  // const toastShown = useRef(false);
  // useEffect(() => {
  //   if (location.state?.loginSuccess && !toastShown.current) {
  //     message.success("Login successful!");
  //     toastShown.current = true;

  //     // Optional: remove the state from history to avoid re-trigger on back
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location]);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      showToast('login-success', 'success', 'Login successful!');
      // Clear state after toast
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);


  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaves();
      // setLeaves(res.data);
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

  useEffect(() => {
    fetchLeaves();
  }, []);

  const columns = [
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

  // const myLeaves = leaves.filter(l => l.name === user.name);
  // const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const handleApply = async (values) => {
    try {
      const formData = new FormData();

      formData.append('leaveType', values.leaveType);
      formData.append('reason', values.reason);
      formData.append('fromDate', values.range[0].format('YYYY-MM-DD'));
      formData.append('toDate', values.range[1].format('YYYY-MM-DD'));

      // File input needs manual handling
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        formData.append('attachment', fileInput.files[0]);
      }

      await applyLeave(formData);

      message.success('Leave applied successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchLeaves();
    } catch (err) {
      console.error('Apply error:', err);
      message.error('Failed to apply for leave');
    }
  };

  const openReviewModal = async () => {
    try {
      const response = await getAllLeaves();
      setAllLeaves(response.data);
      setIsReviewModalVisible(true);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      message.error('Failed to fetch leave requests');
    }
  };

  const handleDecision = async (leaveId, status) => {
    try {
      await updateLeaveStatus(leaveId, status);
      console.log(`Trying to show toast: ${status}`);
      message.success(`Leave ${status.toLowerCase()} successfully!`);
      openReviewModal(); // refresh list
      fetchLeaves(); // refresh dashboard table
    } catch (err) {
      console.error('Decision error:', err);
      message.error(`Failed to ${status.toLowerCase()} leave. Try again.`);
    }
  };





  return (
    <>
      <Header />
      <div style={{ padding: 24 }}>
        <h3>My Applied Leaves</h3>
        {/* {loading ? <Spin /> : (
          <>
            <Table
              dataSource={myLeaves}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Apply for Leave
              </Button>
            </div>
          </>
        )} */}

        {loading ? <Spin /> : (
          <>
            <Table
              dataSource={myLeaves.slice(0, 5)} // Only first 5 leaves
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
            <div style={{ textAlign: 'end', marginTop: 16 }}>
              <Button type="link" style={{ textDecoration: 'underline' }} onClick={() => navigate('/leave-details', { state: { show: 'myLeaves' } })}>
                View All
              </Button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Apply for Leave
              </Button>
            </div>
          </>
        )}


        {user.role === 'manager' && (
          <>
            <h3>Leave Requests (All Pending)</h3>
            <Table
              // dataSource={pendingLeaves}
              dataSource={pendingLeaves.slice(0, 5)} // Only first 5
              columns={columns}
              rowKey="_id"
              pagination={false}
            // pagination={{ pageSize: 5 }}
            />
            <div style={{ textAlign: 'end', marginTop: 16 }}>
              <Button type="link" style={{ textDecoration: 'underline' }} onClick={() => navigate('/leave-details', { state: { show: 'pendingLeaves' } })}>
                View All
              </Button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>

              <Button type="primary" onClick={openReviewModal} >
                Review Leave Requests
              </Button>
            </div>

          </>
        )}

        {/* <Button onClick={() => message.success('This is a test message')}>Test Toast</Button> */}

        <Modal
          title="Apply for Leave"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          okText="Submit"
        >
          <Form form={form} onFinish={handleApply} layout="vertical" encType="multipart/form-data">
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: 'Please select leave type' }]}
            >
              <Input placeholder="e.g., Sick, Casual, Vacation" />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: 'Please enter a reason' }]}
            >
              <Input.TextArea placeholder="e.g., Feeling unwell..." />
            </Form.Item>

            <Form.Item
              name="range"
              label="Leave Duration"
              rules={[{ required: true, message: 'Please select a date range' }]}
            >
              <DatePicker.RangePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="attachment" label="Attachment (Optional)">
              <Input type="file" />
            </Form.Item>
          </Form>

        </Modal>


        <Modal
          title="Review Leave Requests"
          open={isReviewModalVisible}
          onCancel={() => setIsReviewModalVisible(false)}
          footer={null}
          width={1800}
        >
          {/* <div style={{ overflowX: 'auto' }}> */}
          <Table
            dataSource={pendingLeaves}
            rowKey="_id"
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
              },
              {
                title: 'Type',
                dataIndex: 'leaveType',
              },
              {
                title: 'Reason',
                dataIndex: 'reason',
              },
              {
                title: 'From',
                dataIndex: 'fromDate',
                render: date => dayjs(date).format('YYYY-MM-DD'),
              },
              {
                title: 'To',
                dataIndex: 'toDate',
                render: date => dayjs(date).format('YYYY-MM-DD'),
              },
              {
                title: 'Attachment',
                dataIndex: 'attachment',
                render: file =>
                  file ? (
                    <a href={`${API_BASE_URL}/uploads/${file}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    'N/A'
                  ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
              },
              {
                title: 'Action',
                render: (_, record) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleDecision(record._id, 'Approved')}
                      style={{ width: 100 }}
                    >
                      Approve
                    </Button>
                    <Button
                      danger
                      size="small"
                      style={{ width: 100, marginTop: 5 }}
                      onClick={() => handleDecision(record._id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                ),
              },
            ]}
            pagination={false}
            scroll={{ x: true, y: 600 }}
          />
          {/* </div> */}
        </Modal>
      </div>

    </>
  );
};

export default Dashboard;
