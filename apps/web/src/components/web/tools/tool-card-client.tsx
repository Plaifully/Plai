"use client";

import { useEffect, useRef } from "react";
import { useServerAction } from "zsa-react";
import { incrementImpression, incrementView, incrementClick } from "~/actions/analytics";
import type { ToolMany } from "~/server/web/tools/payloads";

interface ToolCardClientProps {
  slug: string;
  children: React.ReactNode;
}

export function ToolCardClient({ slug, children }: ToolCardClientProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);
  
  // Set up server actions
  const { execute: trackImpression } = useServerAction(incrementImpression);
  const { execute: trackView } = useServerAction(incrementView);
  const { execute: trackClick } = useServerAction(incrementClick);
  
  // Track impression when the component mounts
  useEffect(() => {
    trackImpression({ slug }).catch(error => {
      console.error("Error tracking impression:", error);
    });
  }, [slug, trackImpression]);
  
  // Track view when the card becomes visible
  useEffect(() => {
    if (!cardRef.current || viewTracked.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !viewTracked.current) {
          trackView({ slug }).catch(error => {
            console.error("Error tracking view:", error);
          });
          viewTracked.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Card must be 50% visible to count as a view
    );
    
    observer.observe(cardRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [slug, trackView]);
  
  // Track click when the card is clicked
  const handleClick = () => {
    trackClick({ slug }).catch(error => {
      console.error("Error tracking click:", error);
    });
  };
  
  return (
    <div ref={cardRef} onClick={handleClick}>
      {children}
    </div>
  );
} 