"use client";

import { useEffect, useState } from "react";
import {
  fetchHubSpotContactsPaginated,
  searchContactsByCity,
  searchContactsByCompany,
  searchContactsByPostalCode,
} from "@/app/actions/adminSearch";
import { generateBaId } from "@/app/actions/generateBaId";
import { getAllBAIds } from "@/app/actions/getAllBaIds";
import { fetchBaById } from "@/app/actions/fetchBaById";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HubSpotContact } from "@/types/hubspot";
import BaInfoModal from "@/components/BaInfoModal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { assignBaIdToContacts } from "@/app/actions/assignBaIdToContacts";

import AssignBaModal from "@/components/AssignBaModal";

type SelectedUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  state: string | null;
  ba_id: string | null;
  createdAt: Date;
};

type CursorResponse = {
  results: HubSpotContact[];
  paging?: string | null;
  next?: string | null;
};

export default function BAIdAdminPage() {
  const [baIds, setBaIds] = useState<
    { ba_id: string; used: boolean; createdAt: string }[]
  >([]);
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [searchType, setSearchType] = useState<
    "company" | "postalCode" | "city"
  >("company");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [isPaginating, setisPaginating] = useState(false);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<{ [page: number]: string | null }>({
    1: "",
  });
  const [after, setAfter] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const loadBaIds = async () => {
    const res = await getAllBAIds();
    if (res.success && res.data) {
      const formatted = res.data.map((ba) => ({
        ba_id: ba.ba_id,
        used: ba.used,
        createdAt: new Date(ba.createdAt).toISOString(),
      }));
      setBaIds(formatted);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateBaId();
    if (res.success) await loadBaIds();
    setLoading(false);
  };

  const handleBaClick = async (ba_id: string) => {
    const res = await fetchBaById(ba_id);
    setSelectedUser(res.user || null);
    setModalOpen(true);
  };

  const fetchPage = async (pageNum: number) => {
    let res: {
      results: HubSpotContact[];
      paging?: string | null;
      next?: string | null;
    };

    const cursor = cursors[pageNum] ?? "";
    setisPaginating(true);

    const isSearchMode = query.length >= 2;

    if (isSearchMode) {
      setIsSearching(true);
      if (searchType === "company") {
        res = await searchContactsByCompany(query, cursor, 10);
      } else if (searchType === "postalCode") {
        res = await searchContactsByPostalCode(query, cursor, 10);
      } else {
        res = await searchContactsByCity(query, cursor, 10);
      }
    } else {
      setIsSearching(false);
      res = await fetchHubSpotContactsPaginated(10, cursor);
    }

    setContacts(res.results);

    const nextCursor = res.paging ?? res.next ?? null;
    setAfter(nextCursor);

    if (nextCursor) {
      setCursors((prev) => ({
        ...prev,
        [pageNum + 1]: nextCursor,
      }));
    }

    setPage(pageNum);
    setisPaginating(false);
  };

  const handleSearch = () => {
    if (query.length >= 2) {
      setCursors({ 1: "" });
      fetchPage(1);
    }
  };

  const toggleAllVisible = () => {
    const visibleIds = contacts.map((c) => c.id);

    if (allSelected) {
      setSelectedContacts((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedContacts((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    loadBaIds();
    fetchPage(1); // Load first contacts
  }, []);

  useEffect(() => {
    if (query.length === 0 && isSearching) {
      setCursors({ 1: "" });
      fetchPage(1);
    }
  }, [query]);

  useEffect(() => {
    const visibleIds = contacts.map((c) => c.id);
    const allOnPageSelected = visibleIds.every((id) =>
      selectedContacts.includes(id)
    );
    setAllSelected(allOnPageSelected);
  }, [contacts, selectedContacts]);

  return (
    <div className="flex flex-col p-4 w-full min-h-screen h-full">
      {/* BA ID Generator */}
      <div className="flex gap-4 w-full border-b border-b-gray-200 pb-8 mb-8">
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Generate New BA ID</h2>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
        <div className="w-3/4">
          <h3 className="text-lg font-medium">All Generated IDs</h3>
          <div className="rounded-md border overflow-auto max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BA ID</TableHead>
                  <TableHead>Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {baIds.map((ba) => (
                  <TableRow
                    key={ba.ba_id}
                    className="cursor-pointer"
                    onClick={() => handleBaClick(ba.ba_id)}
                  >
                    <TableCell>{ba.ba_id}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          ba.used
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ba.used ? "Yes" : "No"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BaInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
      />

      {/* Contacts Search + Table */}
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-2 justify-center bg-gray-100 p-4 rounded-md">
          <select
            className="border px-3 py-2 rounded-md bg-white"
            value={searchType}
            onChange={(e) =>
              setSearchType(e.target.value as "company" | "postalCode" | "city")
            }
          >
            <option value="company">Store</option>
            <option value="postalCode">Postal Code</option>
            <option value="city">City</option>
          </select>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder={`Search by ${
              searchType === "company" ? "store" : searchType
            }`}
            className="flex-1 w-full max-w-1/2 bg-white"
          />
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setCursors({ 1: "" });
              fetchPage(1);
            }}
          >
            Clear
          </Button>

          <Button onClick={handleSearch}>Search</Button>

          <Button
            onClick={() => setAssignOpen(true)}
            disabled={selectedContacts.length === 0}
          >
            Assign BA ID
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllVisible}
                    aria-label="Select all visible"
                  />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Postal Code</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPaginating ? (
                [...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2 animate-pulse w-[40px]">
                      <div className="h-5 bg-muted rounded w-full" />
                    </TableCell>
                    <TableCell className="py-2 animate-pulse">
                      <div className="h-5 bg-muted rounded w-full" />
                    </TableCell>
                    <TableCell className="py-2 animate-pulse">
                      <div className="h-5 bg-muted rounded w-full" />
                    </TableCell>
                    <TableCell className="py-2 animate-pulse">
                      <div className="h-5 bg-muted rounded w-full" />
                    </TableCell>
                    <TableCell className="py-2 animate-pulse">
                      <div className="h-5 bg-muted rounded w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : contacts.length > 0 ? (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="w-[40px] text-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        aria-label={`Select ${contact.properties.company}`}
                      />
                    </TableCell>
                    <TableCell>{contact.properties.company || "—"}</TableCell>
                    <TableCell>{contact.properties.city || "—"}</TableCell>
                    <TableCell>{contact.properties.state || "—"}</TableCell>
                    <TableCell>{contact.properties.zip || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="ml-auto flex items-center gap-4 text-sm w-fit">
          <Button
            onClick={() => fetchPage(page - 1)}
            disabled={page <= 1 || isPaginating}
          >
            <ArrowLeft />
          </Button>

          <span className="text-gray-400">Page {page}</span>

          <Button
            onClick={() => fetchPage(page + 1)}
            disabled={!cursors[page + 1] || isPaginating}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      <AssignBaModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        selectedContacts={selectedContacts}
      />
    </div>
  );
}
