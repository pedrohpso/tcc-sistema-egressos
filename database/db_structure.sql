CREATE TABLE `user` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  'birthdate' DATE NOT NULL,
  `gender` ENUM ('male', 'female', 'trans_male', 'trans_female', 'non_binary', 'other') NOT NULL,
  `ethnicity` ENUM ('white', 'black', 'brown', 'yellow', 'indigenous', 'not_declared') NOT NULL,
  `graduation_year` YEAR NOT NULL,
  `is_admin` TINYINT NOT NULL DEFAULT 0,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `course` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
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
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `field` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `position` INT NOT NULL,
  `form_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `type` ENUM ('text', 'single_choice', 'multiple_choice', 'date') NOT NULL DEFAULT 'text',
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `indicator`{
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
}

CREATE TABLE `field_option` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `field_dependency` (
  `field_id` INT NOT NULL,
  `dependent_field_id` INT NOT NULL,
  `field_option_id` INT NOT NULL,
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
  `field_id` INT NOT NULL,
  `field_option_id` INT,
  `form_answer_id` INT NOT NULL,
  `text` TEXT,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

ALTER TABLE `user_course` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_course` ADD FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `field` ADD CONSTRAINT `field_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE;

ALTER TABLE `field_option` ADD CONSTRAINT `field_option_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE;

ALTER TABLE `field_dependency` ADD CONSTRAINT `field_dependency_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE;

ALTER TABLE `field_dependency` ADD CONSTRAINT `field_dependency_ibfk_2` FOREIGN KEY (`dependent_field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE;

ALTER TABLE `field_dependency` ADD CONSTRAINT `field_dependency_ibfk_3` FOREIGN KEY (`field_option_id`) REFERENCES `field_option` (`id`) ON DELETE CASCADE;

ALTER TABLE `form_answer` ADD CONSTRAINT `form_answer_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE;

ALTER TABLE `form_answer` ADD CONSTRAINT `form_answer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`field_option_id`) REFERENCES `field_option` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_3` FOREIGN KEY (`form_answer_id`) REFERENCES `form_answer` (`id`) ON DELETE CASCADE;
