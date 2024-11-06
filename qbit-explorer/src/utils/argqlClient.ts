import { GQLUrls, arGql } from "ar-gql";

const argqlClient = arGql({
  endpointUrl: GQLUrls.goldsky,
});

export default argqlClient;
