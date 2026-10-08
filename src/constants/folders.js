export const DEFAULT_PROJECT_FOLDERS = [
  {
    id: "folder_vkhlamov",
    name: "vkhlamov",
    type: "folder",
    date: "2026-06-15T10:00:00Z",
    size: 0,
    x: 20,
    y: 36
  },
  {
    id: "folder_svart_hull",
    name: "svart hull",
    type: "folder",
    date: "2026-06-15T10:00:00Z",
    size: 0,
    x: 20,
    y: 136
  }
];

// File di default precaricati dentro la cartella "svart hull"
export const DEFAULT_SVART_HULL_FILES = [
  {
    id: "svarthull_img_home",
    name: "home.png",
    type: "image",
    size: 869072,
    date: "2026-10-08T21:00:00Z",
    url: "/images/home.png",
    parentFolderId: "folder_svart_hull"
  },
  {
    id: "svarthull_img_loader",
    name: "loader.png",
    type: "image",
    size: 19130,
    date: "2026-10-08T21:00:00Z",
    url: "/images/loader.png",
    parentFolderId: "folder_svart_hull"
  },
  {
    id: "svarthull_img_tabs",
    name: "tabs.png",
    type: "image",
    size: 345382,
    date: "2026-10-08T21:00:00Z",
    url: "/images/tabs.png",
    parentFolderId: "folder_svart_hull"
  },
  {
    id: "svarthull_link_site",
    name: "svarthull.dev.webloc",
    type: "webloc",
    size: 0,
    date: "2026-10-08T21:00:00Z",
    url: "https://svarthull.dev",
    parentFolderId: "folder_svart_hull"
  }
];
