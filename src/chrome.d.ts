// Minimal ambient declarations for the subset of the Chrome extension APIs used
// by this project (MV3, promise-based). Replaces a dependency on @types/chrome
// so the project has no external type dependencies. Extend as new APIs are used.

declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      windowId: number;
      groupId: number;
      active: boolean;
    }
    interface TabChangeInfo {
      url?: string;
      status?: string;
    }
    interface MoveProperties {
      windowId?: number;
      index: number;
    }
    interface GroupOptions {
      tabIds: number | number[];
      groupId?: number;
      createProperties?: { windowId?: number };
    }
    interface UpdateProperties {
      active?: boolean;
    }
    function get(tabId: number): Promise<Tab>;
    function query(queryInfo: Record<string, unknown>): Promise<Tab[]>;
    function move(
      tabId: number,
      moveProperties: MoveProperties,
    ): Promise<Tab | Tab[]>;
    function group(options: GroupOptions): Promise<number>;
    function update(tabId: number, props: UpdateProperties): Promise<Tab>;
    function remove(tabId: number): Promise<void>;
    const onCreated: {
      addListener(callback: (tab: Tab) => void): void;
    };
    const onUpdated: {
      addListener(
        callback: (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void,
      ): void;
    };
  }

  namespace tabGroups {
    type Color =
      | "grey"
      | "blue"
      | "red"
      | "yellow"
      | "green"
      | "pink"
      | "purple"
      | "cyan"
      | "orange";
    interface TabGroup {
      id: number;
      windowId: number;
      title?: string;
      color: Color;
    }
    interface QueryInfo {
      title?: string;
      windowId?: number;
    }
    interface UpdateProperties {
      title?: string;
      color?: Color;
    }
    function query(queryInfo: QueryInfo): Promise<TabGroup[]>;
    function get(groupId: number): Promise<TabGroup>;
    function update(groupId: number, props: UpdateProperties): Promise<TabGroup>;
  }

  namespace windows {
    interface Window {
      id?: number;
    }
    interface CreateData {
      tabId?: number;
      focused?: boolean;
    }
    interface UpdateInfo {
      focused?: boolean;
    }
    function get(windowId: number): Promise<Window>;
    function create(createData: CreateData): Promise<Window | undefined>;
    function update(windowId: number, updateInfo: UpdateInfo): Promise<Window>;
  }

  namespace storage {
    interface StorageArea {
      get(
        keys?: string | string[] | Record<string, unknown> | null,
      ): Promise<Record<string, unknown>>;
      set(items: Record<string, unknown>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
    }
    const local: StorageArea;
  }
}
