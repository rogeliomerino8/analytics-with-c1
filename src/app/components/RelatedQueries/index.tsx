import { useEffect, useState, lazy, Suspense } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import React from "react";
import { ExternalLink } from "lucide-react";

interface RelatedQueriesProps {
  c1Response: string; // the response to generated related queries for
  updatePrompt: (prompt: string) => void;
}

interface RelatedQuery {
  title: string;
  description: string;
  icon: keyof typeof dynamicIconImports;
}

interface RelatedQueriesResponse {
  relatedQueries: RelatedQuery[];
}

export const RelatedQueries: React.FC<RelatedQueriesProps> = ({
  c1Response,
  updatePrompt,
}) => {
  const [relatedQueries, setRelatedQueries] = useState<RelatedQuery[]>([]);

  useEffect(() => {
    const fetchRelatedQueries = async () => {
      const response = await fetch("/api/relatedQueries", {
        method: "POST",
        body: JSON.stringify({ message: c1Response }),
      });
      const data = (await response.json()) as RelatedQueriesResponse;
      setRelatedQueries(data.relatedQueries);
    };

    if (c1Response) {
      fetchRelatedQueries();
    }
  }, [c1Response]);

  if (!relatedQueries.length) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium">Related Queries</h2>
      {relatedQueries.map((query) => (
        <RelatedQueryItem key={query.title} query={query} updatePrompt={updatePrompt} />
      ))}
    </div>
  );
};

const RelatedQueryItem: React.FC<{ query: RelatedQuery, updatePrompt: (prompt: string) => void }> = ({ query, updatePrompt }) => {
  const iconImportFn = dynamicIconImports[query.icon];
  let LucideIcon = null;

  if (iconImportFn) {
    LucideIcon = lazy(iconImportFn);
  }

  return (
    <div className="flex p-4 border border-black/6 rounded-2xl gap-4 bg-white cursor-pointer" key={query.title} onClick={() => updatePrompt(query.title)}>
      <Suspense fallback={<div className="w-4 h-4" />}>
        {LucideIcon && <LucideIcon className="w-4 h-4" />}
        {!LucideIcon && <ExternalLink className="w-4 h-4" />}
      </Suspense>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">{query.title}</h3>
        <p className="text-xs">{query.description}</p>
      </div>
    </div>
  );
};
