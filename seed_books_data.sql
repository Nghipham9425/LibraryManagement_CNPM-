-- Seed data mẫu cho bảng Books với ImageUrl
-- Chạy script này trên Aiven MySQL để thêm data test

INSERT INTO Books (Title, Author, Isbn, Genre, PublicationYear, Publisher, ImageUrl) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Fiction', 1925, 'Scribner', 'https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg'),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Fiction', 1960, 'J.B. Lippincott & Co.', 'https://images-na.ssl-images-amazon.com/images/I/81OtwkiB8bL.jpg'),
('1984', 'George Orwell', '978-0-452-28423-4', 'Dystopian', 1949, 'Secker & Warburg', 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg'),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Romance', 1813, 'T. Egerton', 'https://images-na.ssl-images-amazon.com/images/I/81vg8e4lJbL.jpg'),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 'Fiction', 1951, 'Little, Brown and Company', 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg'),
('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 2008, 'Prentice Hall', 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL.jpg'),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 'Programming', 1999, 'Addison-Wesley', 'https://images-na.ssl-images-amazon.com/images/I/71f1vc2gKCL.jpg'),
('Database System Concepts', 'Abraham Silberschatz', '978-0073523323', 'Computer Science', 2010, 'McGraw-Hill', 'https://images-na.ssl-images-amazon.com/images/I/81maZGCrGjL.jpg'),
('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '978-0590353427', 'Fantasy', 1997, 'Scholastic', 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg'),
('The Lord of the Rings', 'J.R.R. Tolkien', '978-0544003415', 'Fantasy', 1954, 'Houghton Mifflin Harcourt', 'https://images-na.ssl-images-amazon.com/images/I/81g0XnR3jpL.jpg');