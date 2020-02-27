<?php
declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\AbstractModel;
use App\Domain\Provider\Provider;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\{ExclusionPolicy, Expose};
use Ramsey\Uuid\UuidInterface;

/**
 * @ExclusionPolicy("all")
 * @ORM\Entity(repositoryClass="App\Domain\User\UserRepository")
 * @ORM\Table(name="`user`",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(name="user_by_provider", columns={"external_id", "provider_uuid"})
 * })
 * @ORM\HasLifecycleCallbacks
 */
class User extends AbstractModel
{
    /**
     * @var UuidInterface
     *
     * @Expose
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private UuidInterface $uuid;

    /**
     * @var string|null
     *
     * @Expose
     * @ORM\Column(name="`name`", type="string", length=255, nullable=true)
     */
    private ?string $name;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $pseudonym;

    /**
     * @var string|null
     *
     * @Expose
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $email;

    /**
     * @var string|null
     *
     * @Expose
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $avatar_url;

    /**
     * @var string
     *
     * @ORM\Column(name="`token`", type="string", length=255, nullable=false)
     */
    private string $token;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $created;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $updated;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private string $external_id;

    /**
     * @var Provider
     *
     * @ORM\ManyToOne(targetEntity="App\Domain\Provider\Provider", inversedBy="users")
     * @ORM\JoinColumn(name="provider_uuid", referencedColumnName="uuid", onDelete="CASCADE", nullable=false)
     */
    private Provider $provider;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="App\Domain\TrainingData\TrainingData", mappedBy="user")
     */
    private Collection $training_data;

    /**
     * @var Collection
     *
     * @Expose
     * @ORM\OneToMany(targetEntity="App\Domain\TrainingDataValidation\TrainingDataValidation", mappedBy="training_data")
     */
    private Collection $training_data_validations;

    public function __construct()
    {
        $this->training_data = new ArrayCollection();
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
     * @return User
     */
    public function setUuid(UuidInterface $uuid): User
    {
        $this->uuid = $uuid;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return User
     */
    public function setName(?string $name): User
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getPseudonym(): ?string
    {
        return $this->pseudonym;
    }

    /**
     * @param string|null $pseudonym
     * @return User
     */
    public function setPseudonym(?string $pseudonym): User
    {
        $this->pseudonym = $pseudonym;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     * @return User
     */
    public function setEmail(?string $email): User
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }

    /**
     * @param string|null $avatar_url
     * @return User
     */
    public function setAvatarUrl(?string $avatar_url): User
    {
        $this->avatar_url = $avatar_url;
        return $this;
    }

    /**
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * @param string $token
     * @return User
     */
    public function setToken(string $token): User
    {
        $this->token = $token;
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
     * @return User
     */
    public function setCreated(DateTime $created): User
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
     * @return User
     */
    public function setUpdated(DateTime $updated): User
    {
        $this->updated = $updated;
        return $this;
    }

    /**
     * @return string
     */
    public function getExternalId(): string
    {
        return $this->external_id;
    }

    /**
     * @param string $external_id
     * @return User
     */
    public function setExternalId(string $external_id): User
    {
        $this->external_id = $external_id;
        return $this;
    }

    /**
     * @return Provider
     */
    public function getProvider(): Provider
    {
        return $this->provider;
    }

    /**
     * @param Provider $provider
     * @return User
     */
    public function setProvider(Provider $provider): User
    {
        $this->provider = $provider;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getTrainingData(): Collection
    {
        return $this->training_data;
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
     * @return User
     */
    public function setTrainingDataValidations(Collection $training_data_validations): User
    {
        $this->training_data_validations = $training_data_validations;
        return $this;
    }

    /**
     * @param Collection $training_data
     * @return User
     */
    public function setTrainingData(Collection $training_data): User
    {
        $this->training_data = $training_data;
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
