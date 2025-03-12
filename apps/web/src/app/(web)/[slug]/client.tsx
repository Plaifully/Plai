"use client";

import { useEffect } from "react";
import { incrementView, incrementClick } from "~/actions/analytics";
import { ExternalLink } from "~/components/web/external-link";
import { Button } from "~/components/web/ui/button";
import { ToolTier } from "@plai/db/client";

interface ToolClientProps {
  slug: string;
  name: string;
  website: string;
  tier: string;
}

export function ToolClient({ slug, name, website, tier }: ToolClientProps) {
  // Track view when the component mounts
  useEffect(() => {
    incrementView({ slug }).catch(error => {
      console.error("Error tracking view:", error);
    });
  }, [slug]);
  
  // Handle click tracking
  const handleClick = async () => {
    try {
      await incrementClick({ slug });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };
  
  return (
    <>
      {/* Visit website button with click tracking */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <ExternalLink
            href={website}
            rel={tier === ToolTier.Featured ? "noopener noreferrer" : undefined}
            eventName="click_website"
            eventProps={{ url: website }}
            onClick={handleClick}
          >
            Visit {name}
          </ExternalLink>
        </Button>
        
        <Button 
          variant="fancy"
        >
          Hire {name.split(' ')[0]}
        </Button>
      </div>
    </>
  );
} 