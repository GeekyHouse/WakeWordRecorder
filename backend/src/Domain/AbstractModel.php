<?php
declare(strict_types=1);

namespace App\Domain;

use JMS\Serializer\{GraphNavigatorInterface,
    Handler\HandlerRegistry,
    JsonSerializationVisitor,
    SerializationContext,
    SerializerBuilder};
use JsonSerializable;
use Ramsey\Uuid\{Uuid, UuidInterface};

class AbstractModel implements JsonSerializable
{
    /**
     * @param array|null $groups
     * @return array
     */
    public function jsonSerialize(?array $groups = []): array
    {
        $context = null;
        if ($groups) {
            $context = SerializationContext::create()->setGroups($groups);
        }
        return json_decode(
            SerializerBuilder::create()
                ->addDefaultHandlers()
                ->configureHandlers(function (HandlerRegistry $registry) {
                    $registry->registerHandler(GraphNavigatorInterface::DIRECTION_SERIALIZATION, Uuid::class, 'json',
                        function (JsonSerializationVisitor $visitor, UuidInterface $obj, array $type) {
                            return $obj->toString();
                        });
                })
                ->build()
                ->serialize($this, 'json', $context),
            true);
    }
}
