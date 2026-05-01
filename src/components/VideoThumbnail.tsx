import { useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/VideoPlayer";

interface VideoThumbnailProps {
  videoUrl?: string;
  title: string;
  creator?: string;
  duration?: string;
  thumbnailUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function VideoThumbnail({
  videoUrl,
  title,
  creator,
  duration,
  thumbnailUrl,
  onClick,
  className = ""
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Generate YouTube thumbnail URL if videoUrl is provided
  const getYouTubeThumbnail = (url?: string) => {
    if (!url) return null;

    // Handle YouTube shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^&\n?#]+)/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://img.youtube.com/vi/${shortsMatch[1]}/hqdefault.jpg`;
    }

    // Handle regular YouTube videos
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }

    return null;
  };

  const thumbnailSrc = thumbnailUrl || getYouTubeThumbnail(videoUrl) || `https://picsum.photos/seed/${title}/640/360.jpg`;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl) {
      setIsVideoOpen(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <Card
        className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video">
          {/* Thumbnail Image */}
          <img
            src={thumbnailSrc}
            alt={title}
            className={`w-full h-full object-cover ${imageError ? 'hidden' : 'block'}`}
            onError={() => setImageError(true)}
          />

          {/* Fallback gradient if image fails */}
          {imageError && (
            <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
              <Play className="h-12 w-12 text-red-600" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/0 transition-colors flex items-center justify-center ${isHovered ? 'bg-black/40' : ''
            }`}>
            {/* Play button */}
            <div className={`transition-all duration-200 ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
              }`}>
              <div
                className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg cursor-pointer"
                onClick={handleVideoClick}
              >
                <Play className="h-6 w-6 text-red-600 fill-red-600 ml-1" />
              </div>
            </div>
          </div>

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          )}

          {/* Volume indicator */}
          {isHovered && (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white p-1.5 rounded">
              <Volume2 className="h-3 w-3" />
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {title}
            </h3>

            {/* Creator */}
            {creator && (
              <p className="text-xs text-muted-foreground">
                {creator}
              </p>
            )}

            {/* Video badge */}
            <Badge variant="destructive" className="text-xs w-fit">
              Video
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Dialog */}
      <VideoPlayer
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={videoUrl}
        title={title}
      />
    </>
  );
}
