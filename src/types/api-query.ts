type QueryParams = {
  page?: number;
  limit?: number;
  where?: string;
  sort?: string;
  expand?: string[];
};

export default QueryParams;
