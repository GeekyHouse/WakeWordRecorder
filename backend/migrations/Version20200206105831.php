<?php

declare(strict_types=1);

namespace WWR\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200206105831 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE "training_data" (uuid UUID NOT NULL, user_uuid UUID DEFAULT NULL, wake_word_uuid UUID DEFAULT NULL, file_name VARCHAR(255) NOT NULL, is_validated BOOLEAN DEFAULT \'false\' NOT NULL, created TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_A269B420ABFE1C6F ON "training_data" (user_uuid)');
        $this->addSql('CREATE INDEX IDX_A269B42082C30BC5 ON "training_data" (wake_word_uuid)');
        $this->addSql('COMMENT ON COLUMN "training_data".uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN "training_data".user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN "training_data".wake_word_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE "wake_word" (uuid UUID NOT NULL, "label" VARCHAR(255) NOT NULL, label_normalized VARCHAR(255) NOT NULL, created TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('COMMENT ON COLUMN "wake_word".uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE "training_data" ADD CONSTRAINT FK_A269B420ABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "training_data" ADD CONSTRAINT FK_A269B42082C30BC5 FOREIGN KEY (wake_word_uuid) REFERENCES "wake_word" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "training_data" DROP CONSTRAINT FK_A269B42082C30BC5');
        $this->addSql('DROP TABLE "training_data"');
        $this->addSql('DROP TABLE "wake_word"');
    }
}
