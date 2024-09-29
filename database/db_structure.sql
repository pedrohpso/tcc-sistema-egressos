CREATE TABLE `user` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  'birthdate' DATE NOT NULL,
  `gender` ENUM ('male', 'female', 'trans_male', 'trans_female', 'non_binary', 'other') NOT NULL,
  `ethnicity` ENUM ('white', 'black', 'brown', 'yellow', 'indigenous', 'not_declared') NOT NULL,
  `is_admin` TINYINT NOT NULL DEFAULT 0,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `course` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `user_course` (
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `course_id`)
);

CREATE TABLE `form` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `status` ENUM ('draft', 'published') NOT NULL DEFAULT 'draft',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `question` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `position` INT NOT NULL,
  `form_id` INT NOT NULL,
  `text` TEXT NOT NULL,
  `type` ENUM ('text', 'single_choice', 'multiple_choice', 'date') NOT NULL DEFAULT 'text',
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `indicator`{
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
}

CREATE TABLE `possible_answer` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `question_dependency` (
  `question_id` INT NOT NULL,
  `dependent_question_id` INT NOT NULL,
  `possible_answer_id` INT NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

/* Idade do usuário é a birthdate do user com o created do form_answer (idade que ele preencheu o formulário)*/
CREATE TABLE `form_answer` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `answer` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  `possible_answer_id` INT,
  `form_answer_id` INT NOT NULL,
  `text` TEXT,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

ALTER TABLE `user_course` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_course` ADD FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `question` ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE;

ALTER TABLE `possible_answer` ADD CONSTRAINT `possible_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `question_dependency` ADD CONSTRAINT `question_dependency_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `question_dependency` ADD CONSTRAINT `question_dependency_ibfk_2` FOREIGN KEY (`dependent_question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `question_dependency` ADD CONSTRAINT `question_dependency_ibfk_3` FOREIGN KEY (`possible_answer_id`) REFERENCES `possible_answer` (`id`) ON DELETE CASCADE;

ALTER TABLE `form_answer` ADD CONSTRAINT `form_answer_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE;

ALTER TABLE `form_answer` ADD CONSTRAINT `form_answer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`possible_answer_id`) REFERENCES `possible_answer` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_3` FOREIGN KEY (`form_answer_id`) REFERENCES `form_answer` (`id`) ON DELETE CASCADE;
