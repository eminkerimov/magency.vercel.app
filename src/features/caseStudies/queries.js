import { useQuery } from "@tanstack/react-query";
import { getCaseStudies } from "../../api/caseStudies";

export const caseStudiesQueryKeys = {
  all: ["case-studies"],
};

export const useCaseStudiesQuery = () =>
  useQuery({
    queryKey: caseStudiesQueryKeys.all,
    queryFn: ({ signal }) => getCaseStudies(signal),
    select: (response) => response.data,
  });
