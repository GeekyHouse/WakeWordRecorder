<?php
declare(strict_types=1);

namespace App\Domain\TrainingData;

use App\Domain\AbstractModel;
use App\Domain\TrainingDataValidation\TrainingDataValidation;
use App\Domain\User\User;
use App\Domain\WakeWord\WakeWord;
use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\{ExclusionPolicy, Expose, Groups};
use Ramsey\Uuid\UuidInterface;

/**
 * @ExclusionPolicy("all")
 * @ORM\Entity(repositoryClass="App\Domain\TrainingData\TrainingDataRepository")
 * @ORM\Table(name="`training_data`")
 * @ORM\HasLifecycleCallbacks
 */
class TrainingData extends AbstractModel
{
    /**
     * @var UuidInterface
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private UuidInterface $uuid;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     */
    private string $file_name;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $created;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $updated;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="App\Domain\User\User", inversedBy="training_data")
     * @ORM\JoinColumn(name="user_uuid", referencedColumnName="uuid")
     */
    private User $user;

    /**
     * @var WakeWord
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\ManyToOne(targetEntity="App\Domain\WakeWord\WakeWord", inversedBy="training_data")
     * @ORM\JoinColumn(name="wake_word_uuid", referencedColumnName="uuid")
     */
    private WakeWord $wake_word;

    /**
     * @var Collection
     *
     * @Expose
     * @ORM\OneToMany(targetEntity="App\Domain\TrainingDataValidation\TrainingDataValidation", mappedBy="training_data")
     */
    private Collection $training_data_validations;

    public function __construct()
    {
    }

    /**
     * @return UuidInterface
     */
    public function getUuid(): UuidInterface
    {
        return $this->uuid;
    }

    /**
     * @param UuidInterface $uuid
     * @return TrainingData
     */
    public function setUuid(UuidInterface $uuid): TrainingData
    {
        $this->uuid = $uuid;
        return $this;
    }

    /**
     * @return string
     */
    public function getFileName(): string
    {
        return $this->file_name;
    }

    /**
     * @param string $file_name
     * @return TrainingData
     */
    public function setFileName(string $file_name): TrainingData
    {
        $this->file_name = $file_name;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getTrainingDataValidations(): Collection
    {
        return $this->training_data_validations;
    }

    /**
     * @param Collection $training_data_validations
     * @return TrainingData
     */
    public function setTrainingDataValidations(Collection $training_data_validations): TrainingData
    {
        $this->training_data_validations = $training_data_validations;
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
     * @return TrainingData
     */
    public function setUser(User $user): TrainingData
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return WakeWord
     */
    public function getWakeWord(): WakeWord
    {
        return $this->wake_word;
    }

    /**
     * @param WakeWord $wake_word
     * @return TrainingData
     */
    public function setWakeWord(WakeWord $wake_word): TrainingData
    {
        $this->wake_word = $wake_word;
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
     * @return TrainingData
     */
    public function setCreated(DateTime $created): TrainingData
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
     * @return TrainingData
     */
    public function setUpdated(DateTime $updated): TrainingData
    {
        $this->updated = $updated;
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
