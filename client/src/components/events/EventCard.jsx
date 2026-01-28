import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const EventCard = ({ event }) => {
    const {
        id,
        title,
        date,
        time,
        venue,
        category,
        image,
        type
    } = event;

    const categoryColors = {
        IIC: 'blue',
        EMDC: 'purple',
        Association: 'indigo',
    };

    const badgeVariant =
        category === 'IIC' ? 'primary' :
            category === 'EMDC' ? 'purple' :
                'indigo';

    return (
        <Card className="h-full flex flex-col group">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant={badgeVariant} className="shadow-sm backdrop-blur-sm bg-opacity-90">
                        {category}
                    </Badge>
                    <Badge variant="secondary" className="shadow-sm backdrop-blur-sm bg-opacity-90">
                        {type}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <Card.Content className="flex-grow flex flex-col">
                {/* Date Badge (floating style alternative, or just text) */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{time}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <div className="flex items-start text-sm text-gray-500 mb-6">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">{venue}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link to={`/events/${id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                            View Details
                        </Button>
                    </Link>
                </div>
            </Card.Content>
        </Card>
    );
};

export default EventCard;
