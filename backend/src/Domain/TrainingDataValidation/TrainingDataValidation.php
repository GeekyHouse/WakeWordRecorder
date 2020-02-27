<?php
declare(strict_types=1);

namespace App\Domain\TrainingDataValidation;

use App\Domain\AbstractModel;
use App\Domain\TrainingData\TrainingData;
use App\Domain\User\User;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\{ExclusionPolicy, Expose, Groups};

/**
 * @ExclusionPolicy("all")
 * @ORM\Entity(repositoryClass="App\Domain\TrainingDataValidation\TrainingDataValidationRepository")
 * @ORM\Table(name="`training_data_validation`")
 * @ORM\HasLifecycleCallbacks
 */
class TrainingDataValidation extends AbstractModel
{
    /**
     * @var boolean
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="boolean", nullable=false)
     */
    private bool $validated;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", nullable=false)
     */
    private DateTime $created;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", nullable=false)
     */
    private DateTime $updated;

    /**
     * @var User
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="App\Domain\User\User", inversedBy="training_data_validations")
     * @ORM\JoinColumn(name="user_uuid", referencedColumnName="uuid")
     */
    private User $user;

    /**
     * @var TrainingData
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="App\Domain\TrainingData\TrainingData", inversedBy="training_data_validations")
     * @ORM\JoinColumn(name="training_data_uuid", referencedColumnName="uuid")
     */
    private TrainingData $training_data;

    /**
     * @return bool
     */
    public function isValidated(): bool
    {
        return $this->validated;
    }

    /**
     * @param bool $validated
     * @return TrainingDataValidation
     */
    public function setValidated(bool $validated): TrainingDataValidation
    {
        $this->validated = $validated;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getCreated(): DateTime
    {
        return $this->created;
    }

    /**
     * @param DateTime $created
     * @return TrainingDataValidation
     */
    public function setCreated(DateTime $created): TrainingDataValidation
    {
        $this->created = $created;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getUpdated(): DateTime
    {
        return $this->updated;
    }

    /**
     * @param DateTime $updated
     * @return TrainingDataValidation
     */
    public function setUpdated(DateTime $updated): TrainingDataValidation
    {
        $this->updated = $updated;
        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return TrainingDataValidation
     */
    public function setUser(User $user): TrainingDataValidation
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return TrainingData
     */
    public function getTrainingData(): TrainingData
    {
        return $this->training_data;
    }

    /**
     * @param TrainingData $trainingData
     * @return TrainingDataValidation
     */
    public function setTrainingData(TrainingData $trainingData): TrainingDataValidation
    {
        $this->training_data = $trainingData;
        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updateUpdatedDateTime()
    {
        $dateTimeNow = new DateTime('now');

        $this->setUpdated($dateTimeNow);

        if (!isset($this->created)) {
            $this->setCreated($dateTimeNow);
        }
    }
}
