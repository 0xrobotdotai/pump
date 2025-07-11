import { action, makeAutoObservable } from "mobx";
import { GridIcon } from "@/components/icons";
import { debounce, isEmpty } from "lodash";
import { gql } from "graphql-request";
import { AsyncState } from "./AsyncState";
import { client } from "@/lib/subgraphClient";
import { TOKEN } from "./types/token";

type SortOrder = "asc" | "desc";

type SortBy = "marketCap" | "createdAt";

export type ListType = "list" | "list_detail" | "card";

type SortOptionItem = {
  label: string;
  value: SortBy;
};

type SortOrderOptionItem = {
  label: string;
  value: SortOrder;
};

export class MarketStore {
  loading: boolean = true;
  tokens: TOKEN[] = [];
  total: number = 0;
  limit: number = 10;
  page: number = 0;
  sortOrder: string = "desc";
  sortBy: string = "createdAt";
  listed: boolean = false;
  animation: boolean = true;

  itemsPerPage: number = 12;
  currentPage: number = 1;

  // 被禁用的token列表
  banTokens: string[] = [
    "0x3bd141cc88de5acbe8dc8ea3d90674bddd0c72c6",
    "0xa57abb6ad3681ec901084507dad8d5afc311af4a",
    "0x3199cf69067e50742117465cf3fb511a81abec2d",
    "0x01d6fc6c64e0b13dc3ba4709debdd0f29f54b9f5",
    "0xca5a4e34289325efe2dc34ae263029430bc92439",
    "0xc1fc5269a39acd45a832142fdd18311a6df2f603",
    "0x78a6b4663b70e19a49199e352c6b351b4c111133",
    "0x3b478620dfacfd097afc429259b3e11b2976bd60",
    "0x277c833d72af8129b67903645852b891eb5f49c3",
    "0x543d3c8138213869725022e827781412f9851d63",
    "0xb203b3ca70d2f8db8fd73a7b5915d3eee2e43646",
    "0x9b0eeccfb0093ae60da6b67fe6e9bb1114458cae",
  ];

  listType: ListType = "card";
  listTypes: { type: ListType; icon: React.FC }[] = [
    {
      type: "card",
      icon: GridIcon,
    },
  ];

  sortOrderOptions: SortOrderOptionItem[] = [
    {
      label: "Asc",
      value: "asc",
    },
    {
      label: "Desc",
      value: "desc",
    },
  ];

  sortOptions: SortOptionItem[] = [
    {
      label: "Market Cap",
      value: "marketCap",
    },
    {
      label: "Creation Time",
      value: "createdAt",
    },
  ];

  // search token
  showSearch: boolean = false;
  keyword: string = "";
  searchLoading: boolean = false;
  searchTokens: TOKEN[] = [];
  searchPage: number = 0;
  searchLimit: number = 10;
  searchTotal: number = 0;
  searchSortOrder: Set<string> = new Set(["desc"]);
  searchSortBy: Set<string> = new Set(["createdAt"]);
  searchListType: ListType = "list";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(v: Partial<MarketStore>) {
    Object.assign(this, v);
  }

  setSortOrder(v: any) {
    this.sortOrder = v;
    this.getTokens.execute();
  }

  setSortBy(v: any) {
    this.sortBy = v;
    this.getTokens.execute();
  }

  changeList(v: boolean) {
    this.listed = v;
    this.currentPage = 1;
    this.getTokens.execute();
  }

  setAnimation(v: boolean) {
    this.animation = v;
  }

  setListType = action((v: ListType) => {
    this.listType = v;
  });

  get hasMore() {
    if (this.page === 0) {
      return true;
    }
    return this.page * this.limit < this.total;
  }

  setSearchSortOrder(v: any) {
    this.searchSortOrder = v;
  }

  setSearchSortBy(v: any) {
    this.searchSortBy = v;
  }

  setSearchListType = action((v: ListType) => {
    this.searchListType = v;
  });

  get searchHasMore() {
    if (this.searchPage === 0) {
      return true;
    }
    return this.searchPage * this.searchLimit < this.searchTotal;
  }

  clearSearch = action(() => {
    this.showSearch = false;
    this.keyword = "";
    this.searchTokens = [];
    this.searchPage = 0;
    this.searchTotal = 0;
  });

  debounceFetchSearchTokens = debounce(() => {
    this.fetchSearchTokens();
  }, 500);

  fetchSearchTokens = action(async () => {
    this.setData({
      currentPage: 1,
    });
    this.getTokens.execute();
  });

  getRobotPads = new AsyncState({
    action: async () => {
      const data: {
        robotPads: { totalToken: string; totalLaunched: string }[];
      } = await client.request(
        gql`
          query {
            robotPads {
              totalToken
              totalLaunched
            }
          }
        `
      );

      return data.robotPads?.[0];
    },
  });

  getTokens = new AsyncState({
    action: async () => {
      try {
        this.loading = true;
        let variables: any = {
          first: this.itemsPerPage,
          skip: (this.currentPage - 1) * this.itemsPerPage,
          orderBy: this.sortBy,
          orderDirection: this.sortOrder,
          banTokens: this.banTokens,
        };

        const isEmpyt = this.keyword == "";

        const data: { tokens: TOKEN[] } = await client.request(
          gql`
            query ($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String, $banTokens: [String!]!) {
              tokens(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, blocked: false, 
              where:  {
                id_not_in: $banTokens
                ${
                  isEmpyt
                    ? ""
                    : `or: [{name_starts_with_nocase: "${this.keyword}"}, {symbol_starts_with_nocase: "${this.keyword}"}],`
                } 
                ${this.listed ? `launchedAt_gte: "0"` : ""}
              }
            ) 
            {
                id
                name
                symbol
                price
                createdAt
                completed
                launchedTx
                launchedAt
                info
                creator
                marketCap
              }
            }
          `,
          variables
        );
        console.log("data", data);

        this.tokens = data?.tokens?.map((token: TOKEN) => {
          const data = this.fomatTokenInfo(token.info);
          return {
            ...token,
            ...data,
          };
        });

        return this.tokens;
      } catch (error) {
        return false;
      } finally {
        this.loading = false;
      }
    },
  });

  getRandomToken = new AsyncState({
    action: async () => {
      try {
        this.loading = true;
        const data: { tokens: TOKEN[] } = await client.request(
          gql`
            query ($first: Int!, $banTokens: [String!]!) {
              tokens(
                first: $first
                orderBy: createdAt
                orderDirection: desc
                blocked: false
                where: { completed: false, id_not_in: $banTokens }
              ) {
                id
                name
                symbol
                price
                createdAt
                completed
                launchedTx
                launchedAt
                info
                creator
                marketCap
              }
            }
          `,
          {
            first: 10,
            banTokens: this.banTokens,
          }
        );

        const filterTokens = data?.tokens?.map((token: TOKEN) => {
          const data = this.fomatTokenInfo(token.info);
          return {
            ...token,
            ...data,
          };
        });
        return filterTokens[Math.floor(Math.random() * filterTokens.length)];
      } catch (error) {
        return false;
      } finally {
        this.loading = false;
      }
    },
  });

  getMyToken = new AsyncState({
    value: [] as TOKEN[],
    action: async (address: string) => {
      try {
        this.loading = true;
        const data: { tokens: TOKEN[] } = await client.request(
          gql`
            query ($creator: String!) {
              tokens(
                where: { creator: $creator }
                orderBy: createdAt
                orderDirection: desc
                blocked: false
              ) {
                id
                name
                symbol
                price
                createdAt
                completed
                launchedTx
                launchedAt
                info
                creator
                marketCap
                blocked
              }
            }
          `,
          {
            creator: address,
          }
        );

        return (
          data?.tokens?.map((token: TOKEN) => {
            const data = this.fomatTokenInfo(token.info);
            return {
              ...token,
              ...data,
            };
          }) || []
        );
      } catch (error) {
        return false;
      } finally {
        this.loading = false;
      }
    },
  });

  extractFilenameFromUrl(url: string) {
    const hashMatch = url.match(/ipfs\/([^?]+)/);
    const filenameMatch = url.match(/filename=([^&]+)/);

    if (hashMatch && hashMatch[1] && filenameMatch && filenameMatch[1]) {
      const hash = hashMatch[1];
      const extension = filenameMatch[1].split(".").pop();
      return `${hash}.${extension === "jpg" ? "jpeg" : extension}`;
    } else {
      throw new Error("Invalid URL: Missing IPFS hash or filename");
    }
  }

  fomatTokenInfo(tokenInfo: string) {
    const info = JSON.parse(tokenInfo);
    let url = info?.image;
    const isWrongCdn = info.image?.includes("cdn.img2ipfs.com");
    if (isWrongCdn) {
      const urlName = this.extractFilenameFromUrl(info.image);
      url = isWrongCdn
        ? `https://robotai-pump.mypinata.cloud/ipfs/QmaaMgXhTHFd4EA3R2DoVGrA4N7pT1VfjJtLcLY7z9BTUm/${urlName}`
        : info.image;
    }

    const isWrongipfs = info.image?.includes("i2.img2ipfs.com");
    if (isWrongipfs) {
      const urlName = this.extractFilenameFromUrl(info.image);
      url = isWrongCdn
        ? `https://robotai-pump.mypinata.cloud/ipfs/QmaaMgXhTHFd4EA3R2DoVGrA4N7pT1VfjJtLcLY7z9BTUm/${urlName}`
        : info.image;
    }

    return {
      ...info,
      image: url,
    };
  }
}
