-- Insert default course (TADS)
INSERT INTO course (name) VALUES ('Análise e Desenvolvimento de Sistemas');

-- Insert default user (admin)
INSERT INTO user (name, email, password, is_admin) VALUES ('Admin', 'admin@admin.com', '$2b$10$50v13f3j/92W31SoK0mbdu8jxaFBKV7FGjyDT7ontCy0vTvOggcD6', 1);