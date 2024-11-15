// Choosing `Zustand` for state management since the global state for this app is relatively simple.
//export const contactsAtom = atom([]);

import { create } from "zustand";

const useGlobalStore = create((set) => ({
  user: {},
  setUser: (_user) => set((state) => ({ ...state, user: _user })),
  contacts: [],
  setContacts: (_contacts) =>
    set((state) => ({ ...state, contacts: _contacts })),

  breadCrumbs: [{ name: "Projects", href: "/projects" }],
  setBreadCrumbs: (_breadCrumbs) =>
    set((state) => ({ ...state, breadCrumbs: _breadCrumbs })),
  addBreadCrumb: (name, href) =>
    set((state) => ({
      ...state,
      breadCrumbs: [...state.breadCrumbs, { name, href }],
    })),
}));

export default useGlobalStore;
