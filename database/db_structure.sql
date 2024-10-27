CREATE SCHEMA `alumni_system`;

USE `alumni_system`;

CREATE TABLE `user` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `birthdate` DATE,
  `gender` ENUM ('male', 'female', 'trans_male', 'trans_female', 'non_binary', 'other'),
  `ethnicity` ENUM ('white', 'black', 'brown', 'yellow', 'indigenous', 'not_declared'),
  `graduation_year` YEAR,
  `is_admin` TINYINT NOT NULL DEFAULT 0,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted'
);

CREATE TABLE `course` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `user_course` (
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `course_id`),
  CONSTRAINT `fk_user_course_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_course_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE
);

CREATE TABLE `form` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `status` ENUM ('draft', 'published') NOT NULL DEFAULT 'draft',
  `title` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_form_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_form_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE
);

CREATE TABLE `field` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `position` INT NOT NULL,
  `form_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `type` ENUM ('text', 'single_choice', 'multiple_choice', 'date') NOT NULL DEFAULT 'text',
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_field_form` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE
);

CREATE TABLE `indicator` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_indicator_field` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE
);

CREATE TABLE `field_option` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_field_option_field` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE
);

CREATE TABLE `field_dependency` (
  `field_id` INT NOT NULL,
  `dependent_field_id` INT NOT NULL,
  `field_option_id` INT NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_field_dependency_field` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_field_dependency_dependent_field` FOREIGN KEY (`dependent_field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_field_dependency_field_option` FOREIGN KEY (`field_option_id`) REFERENCES `field_option` (`id`) ON DELETE CASCADE
);

CREATE TABLE `form_answer` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_form_answer_form` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_form_answer_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

CREATE TABLE `answer` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `field_option_id` INT,
  `form_answer_id` INT NOT NULL,
  `text` TEXT,
  `created` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) COMMENT 'date this record was created',
  `modified` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
  `deleted` datetime DEFAULT null COMMENT 'date this record was deleted',
  CONSTRAINT `fk_answer_field` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_field_option` FOREIGN KEY (`field_option_id`) REFERENCES `field_option` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_form_answer` FOREIGN KEY (`form_answer_id`) REFERENCES `form_answer` (`id`) ON DELETE CASCADE
);
