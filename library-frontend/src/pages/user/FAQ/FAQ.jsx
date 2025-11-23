import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const faqs = [
    {
      category: 'Đăng ký và Tài khoản',
      questions: [
        {
          q: 'Làm thế nào để đăng ký tài khoản thư viện?',
          a: 'Bạn cần đến quầy thư viện với CMND/CCCD và giấy tờ chứng minh là sinh viên/giảng viên của trường. Sau đó, thủ thư sẽ tạo tài khoản và cấp thẻ thư viện cho bạn.'
        },
        {
          q: 'Tôi quên mật khẩu, làm sao để lấy lại?',
          a: 'Bạn có thể liên hệ trực tiếp với thủ thư qua email library@huflit.edu.vn hoặc đến quầy thư viện để được hỗ trợ reset mật khẩu.'
        },
        {
          q: 'Thẻ thư viện có thời hạn bao lâu?',
          a: 'Thẻ thư viện có hiệu lực 4 năm kể từ ngày cấp. Sau đó bạn cần gia hạn thẻ tại quầy thư viện.'
        }
      ]
    },
    {
      category: 'Mượn và Trả Sách',
      questions: [
        {
          q: 'Tôi có thể mượn tối đa bao nhiêu quyển sách?',
          a: 'Mỗi tài khoản được phép mượn tối đa 3 đầu sách cùng lúc. Bạn cần trả sách cũ trước khi mượn sách mới khi đã đủ hạn mức.'
        },
        {
          q: 'Thời hạn mượn sách là bao lâu?',
          a: 'Thời hạn mượn sách mặc định là 15 ngày. Bạn có thể gia hạn thêm 1 lần (7 ngày) nếu sách không có người đặt trước.'
        },
        {
          q: 'Làm thế nào để gia hạn sách?',
          a: 'Bạn có thể gia hạn trực tuyến qua trang web trong mục "Sách đã mượn" hoặc liên hệ thủ thư. Lưu ý: Chỉ được gia hạn 1 lần và tổng thời gian không quá 22 ngày.'
        },
        {
          q: 'Nếu trả sách muộn thì bị phạt như thế nào?',
          a: 'Phạt quá hạn là 5,000 VNĐ/ngày/cuốn sách. Bạn cần thanh toán phí phạt trước khi có thể mượn sách tiếp theo.'
        },
        {
          q: 'Tôi làm mất sách thì phải làm gì?',
          a: 'Vui lòng báo ngay cho thủ thư. Bạn sẽ bị phạt 100,000 VNĐ cho sách bị mất. Nếu sách bị hỏng, phạt là 50,000 VNĐ.'
        }
      ]
    },
    {
      category: 'Tìm Kiếm Sách',
      questions: [
        {
          q: 'Làm sao để tìm sách trong thư viện?',
          a: 'Bạn có thể sử dụng thanh tìm kiếm trên trang chủ để tìm theo tên sách, tác giả, ISBN hoặc lọc theo thể loại.'
        },
        {
          q: 'Làm thế nào để biết sách còn sẵn để mượn?',
          a: 'Khi xem chi tiết sách, hệ thống sẽ hiển thị trạng thái "Có sẵn" hoặc "Đã được mượn" của từng bản sao.'
        },
        {
          q: 'Tôi có thể đặt trước sách không?',
          a: 'Hiện tại hệ thống chưa hỗ trợ đặt trước. Bạn cần kiểm tra tình trạng sách và mượn khi sách có sẵn.'
        }
      ]
    },
    {
      category: 'Vấn Đề Kỹ Thuật',
      questions: [
        {
          q: 'Trang web không tải được, tôi phải làm gì?',
          a: 'Hãy thử làm mới trang (F5) hoặc xóa cache trình duyệt. Nếu vẫn không được, vui lòng liên hệ bộ phận hỗ trợ kỹ thuật.'
        },
        {
          q: 'Tôi không thấy lịch sử mượn sách của mình?',
          a: 'Đảm bảo bạn đã đăng nhập đúng tài khoản. Nếu vẫn không thấy, hãy liên hệ thủ thư để kiểm tra.'
        },
        {
          q: 'Ứng dụng có hỗ trợ trên điện thoại không?',
          a: 'Có! Website được thiết kế responsive, hoạt động tốt trên cả máy tính và điện thoại di động.'
        }
      ]
    }
  ];

  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <FaQuestionCircle size={64} className="text-primary mb-3" />
            <h1 className="display-4 fw-bold text-primary mb-3">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="lead text-muted">
              Tìm câu trả lời cho các thắc mắc phổ biến về dịch vụ thư viện
            </p>
          </div>
        </Col>
      </Row>

      {/* FAQ Sections */}
      {faqs.map((section, sectionIndex) => (
        <Row key={sectionIndex} className="mb-4">
          <Col lg={10} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="text-primary mb-4">
                  {section.category}
                </h4>
                <Accordion>
                  {section.questions.map((item, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        <strong>{item.q}</strong>
                      </Accordion.Header>
                      <Accordion.Body className="text-muted">
                        {item.a}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}

      {/* Still have questions */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="bg-primary text-white text-center border-0">
            <Card.Body className="p-5">
              <h4 className="fw-bold mb-3">Vẫn còn thắc mắc?</h4>
              <p className="mb-4">
                Đừng ngại liên hệ với chúng tôi! Đội ngũ thư viện luôn sẵn sàng hỗ trợ bạn.
              </p>
              <a href="/contact" className="btn btn-light btn-lg">
                Liên Hệ Ngay
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FAQ;
