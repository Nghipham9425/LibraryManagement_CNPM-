import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import { FaCog, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { settingsAPI } from '../../../apis';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.getAll();
      setSettings(data);
      
      // Initialize form values
      const initialValues = {};
      data.forEach(setting => {
        initialValues[setting.key] = setting.value;
      });
      setFormValues(initialValues);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải cấu hình hệ thống');
      toast.error('Lỗi khi tải cấu hình');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Update all changed settings
      const updates = settings.map(setting => 
        settingsAPI.update(setting.key, formValues[setting.key])
      );
      
      await Promise.all(updates);
      
      toast.success('Cập nhật cấu hình thành công!');
      await fetchSettings(); // Reload to get updated timestamps
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật cấu hình';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getSettingLabel = (key) => {
    const labels = {
      MaxBorrowDays: 'Số ngày mượn tối đa',
      MaxBooksPerUser: 'Số sách được mượn đồng thời',
      MaxRenewCount: 'Số lần gia hạn tối đa',
      RenewExtensionDays: 'Số ngày gia hạn thêm mỗi lần',
      MaxTotalBorrowDays: 'Tổng số ngày mượn tối đa',
      LostBookFine: 'Mức phạt sách mất (VND)',
      DamagedBookFine: 'Mức phạt sách hỏng (VND)',
      CardValidityYears: 'Thời hạn thẻ thư viện (năm)',
      OverdueFinePerDay: 'Phạt quá hạn mỗi ngày (VND)'
    };
    return labels[key] || key;
  };

  const getInputSuffix = (key, dataType) => {
    if (dataType === 'decimal' || key.includes('Fine')) {
      return 'VND';
    }
    if (key.includes('Days')) {
      return 'ngày';
    }
    if (key.includes('Years')) {
      return 'năm';
    }
    if (key.includes('Count') || key.includes('Books')) {
      return 'lần/cuốn';
    }
    return '';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Đang tải cấu hình...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <FaCog className="me-2" />
            Cấu Hình Hệ Thống
          </h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Alert variant="info">
            <strong>Lưu ý:</strong> Các thay đổi sẽ áp dụng ngay lập tức cho toàn hệ thống. 
            Vui lòng cân nhắc kỹ trước khi thay đổi.
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Borrowing Settings */}
              <Col md={12}>
                <h5 className="mb-3 text-primary">Cài đặt mượn sách</h5>
              </Col>
              
              {settings.filter(s => 
                ['MaxBorrowDays', 'MaxBooksPerUser', 'MaxRenewCount', 'RenewExtensionDays', 'MaxTotalBorrowDays'].includes(s.key)
              ).map(setting => (
                <Col md={6} key={setting.id} className="mb-3">
                  <Form.Group>
                    <Form.Label>{getSettingLabel(setting.key)}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={formValues[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={saving}
                        min="0"
                        required
                      />
                      {getInputSuffix(setting.key, setting.dataType) && (
                        <InputGroup.Text>{getInputSuffix(setting.key, setting.dataType)}</InputGroup.Text>
                      )}
                    </InputGroup>
                    {setting.description && (
                      <Form.Text className="text-muted">{setting.description}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              ))}

              {/* Fine Settings */}
              <Col md={12} className="mt-3">
                <h5 className="mb-3 text-primary">Cài đặt phạt/bồi thường</h5>
              </Col>
              
              {settings.filter(s => 
                ['LostBookFine', 'DamagedBookFine', 'OverdueFinePerDay'].includes(s.key)
              ).map(setting => (
                <Col md={6} key={setting.id} className="mb-3">
                  <Form.Group>
                    <Form.Label>{getSettingLabel(setting.key)}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={formValues[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={saving}
                        min="0"
                        step="1000"
                        required
                      />
                      {getInputSuffix(setting.key, setting.dataType) && (
                        <InputGroup.Text>{getInputSuffix(setting.key, setting.dataType)}</InputGroup.Text>
                      )}
                    </InputGroup>
                    {setting.description && (
                      <Form.Text className="text-muted">{setting.description}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              ))}

              {/* Card Settings */}
              <Col md={12} className="mt-3">
                <h5 className="mb-3 text-primary">Cài đặt thẻ thư viện</h5>
              </Col>
              
              {settings.filter(s => 
                ['CardValidityYears'].includes(s.key)
              ).map(setting => (
                <Col md={6} key={setting.id} className="mb-3">
                  <Form.Group>
                    <Form.Label>{getSettingLabel(setting.key)}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={formValues[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        disabled={saving}
                        min="1"
                        required
                      />
                      {getInputSuffix(setting.key, setting.dataType) && (
                        <InputGroup.Text>{getInputSuffix(setting.key, setting.dataType)}</InputGroup.Text>
                      )}
                    </InputGroup>
                    {setting.description && (
                      <Form.Text className="text-muted">{setting.description}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={saving}
                size="lg"
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </Form>

          <div className="mt-4">
            <small className="text-muted">
              Cập nhật lần cuối: {settings[0] && new Date(settings[0].updatedAt).toLocaleString('vi-VN')}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
