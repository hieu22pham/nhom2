import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import "./styles.css"

const { Option } = Select;

function QuanLyNhanVien() {
  const navigate = useNavigate([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [lichTrinhCongViec, setLichTrinhCongViec] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);
  const { setTenNhanVien, setPathTenNhanVien } =
    React.useContext(AuthContext);

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("NhanVien");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachNhanVien(productsData);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };



  const memoizedFetchLichTrinhCongViec = useMemo(() => fetchLichTrinhCongViec, [lichTrinhCongViec]);

  useEffect(() => {
    memoizedFetchLichTrinhCongViec();
  }, [lichTrinhCongViec.length || DanhSachNhanVien.length]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const newProductData = {
          ...form.getFieldsValue(),
        };
        addDocument("NhanVien", newProductData);
        const categoryRef = db.collection("NhanVien");
        memoizedFetchLichTrinhCongViec();
        const categorySnapshot = categoryRef.get();
        if (!categorySnapshot.exists) {
          categoryRef.doc('dummyDoc').set({});
        }
        form.resetFields();
        setIsAddProductVisible(false);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAddProductVisible(false);
  };

  const addProduct = () => {
    setIsAddProductVisible(true);
  }

  const handleDeleteDoc = (item) => {
    setIsModalOpen(true);
    setSelectedProduct(item);
  };

  const handleOkDelete = () => {
    setLoading(true);
    const batch = db.batch();

    deleteDocument("NhanVien", selectedProduct.createdAt);

    setLoading(false);
    setIsModalOpen(false);
    memoizedFetchLichTrinhCongViec();
  };


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
  };

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Vui lòng chọn ngày!',
      },
    ],
  };

  const handleXemNhanVien = (item) => {
    var result = item;
    result = result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Loại bỏ dấu cách
    result = result.replace(/\s/g, "");
    setTenNhanVien(item);
    setPathTenNhanVien(result)
    navigate(`/admin/nhan-vien/${result}`);
  }

  return (
    <>
      <div className='AllLichTrinh'>
        <Button className='btnAddProductCate' onClick={addProduct}><span>Thêm nhân viên</span></Button>
        <Modal
          title='Thêm nhân viên'
          visible={isAddProductVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              Đồng ý
            </Button>,
          ]}
        >
          <Form form={form} layout='vertical'>
            {/* Form fields */}
            <Form.Item
              label='Tên nhân viên'
              name='HoTenNhanVien'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn tên nhân viên!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập giới tính' required />
            </Form.Item>
            <Form.Item
              label='Url ảnh nhân viên'
              name='url'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn url ảnh nhân viên!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập url' required />
            </Form.Item>
            <Form.Item
              label='Giới tính'
              name='gioiTinh'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giới tính!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập giới tính' required />
            </Form.Item>
            <Form.Item
              label='Ngày sinh'
              name='ngaySinh'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập ngày sinh!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập ngày sinh' required />
            </Form.Item>
            <Form.Item
              label='Số điện thoại'
              name='sdt'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập số điện thoại' required />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Email!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập Email' required />
            </Form.Item>
            <Form.Item
              label='Địa chỉ'
              name='diaChi'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập địa chỉ' required />
            </Form.Item>
            <Form.Item
              label='Vị trí làm việc'
              name='viTriLamViec'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vị trí làm việc!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập vị trí làm việc' required />
            </Form.Item>
            <Form.Item
              label='Tài khoản'
              name='taiKhoan'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tài khoản!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập tài khoản' required />
            </Form.Item>
            <Form.Item
              label='Mật khẩu'
              name='matKhau'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập mật khẩu' required />
            </Form.Item>
          </Form>
        </Modal >
        <h2 className='tittle'>Chọn nhân viên: </h2>
        <Row>
          {DanhSachNhanVien.map((item) => (
            <Col key={item.id} span="8">
              <Modal
                title="Thông báo!"
                onOk={() => handleOkDelete(item.createdAt)}
                onCancel={handleCancelDelete}
                visible={isModalOpen}
                confirmLoading={loading}
                footer={[
                  <Button key="back" onClick={handleCancelDelete}>
                    Hủy
                  </Button>,
                  <Button key="submit" type="primary" loading={loading} onClick={handleOkDelete}>
                    Đồng ý
                  </Button>,
                ]}
              ></Modal>
              {item.HoTenNhanVien &&
                <div className='border'>
                  <div className='nhanVien__admin'>
                    {item.HoTenNhanVien && (
                      <div className='lich__admin__item'>
                        <div className='lich__admin__name'>
                          <h3>{item.HoTenNhanVien}</h3>
                        </div>
                        <button onClick={() => handleXemNhanVien(item.HoTenNhanVien)}>Xem chi tiết</button>
                        <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button>
                      </div>
                    )}
                  </div>
                </div>
              }
            </Col>
          ))}
        </Row>
      </div>
    </>
  )
}

export default QuanLyNhanVien;