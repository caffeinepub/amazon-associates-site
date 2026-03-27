import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Database,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, SiteSettings } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetAllProducts,
  useGetSiteSettings,
  useIsAdmin,
  useSeedSampleData,
  useUpdateProduct,
  useUpdateSiteSettings,
} from "../hooks/useQueries";

type ProductForm = {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviewCount: string;
  amazonUrl: string;
  category: string;
  featured: boolean;
  recommended: boolean;
};

const EMPTY_PRODUCT_FORM: ProductForm = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
  originalPrice: "",
  rating: "4.5",
  reviewCount: "0",
  amazonUrl: "",
  category: "1",
  featured: false,
  recommended: false,
};

function productToForm(p: Product): ProductForm {
  return {
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    price: (Number(p.price) / 100).toFixed(2),
    originalPrice: (Number(p.originalPrice) / 100).toFixed(2),
    rating: String(p.rating),
    reviewCount: String(Number(p.reviewCount)),
    amazonUrl: p.amazonUrl,
    category: String(Number(p.category)),
    featured: p.featured,
    recommended: p.recommended,
  };
}

function formToProduct(form: ProductForm, id: bigint): Product {
  return {
    id,
    title: form.title,
    description: form.description,
    imageUrl: form.imageUrl,
    price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
    originalPrice: BigInt(
      Math.round(Number.parseFloat(form.originalPrice) * 100),
    ),
    rating: Number.parseFloat(form.rating),
    reviewCount: BigInt(Number.parseInt(form.reviewCount, 10)),
    amazonUrl: form.amazonUrl,
    category: BigInt(Number.parseInt(form.category, 10)),
    featured: form.featured,
    recommended: form.recommended,
    createdAt: 0n,
  };
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const { data: siteSettings } = useGetSiteSettings();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateSettings = useUpdateSiteSettings();
  const seedData = useSeedSampleData();

  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    editing?: Product;
  }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    productId?: bigint;
  }>({
    open: false,
  });
  const [form, setForm] = useState<ProductForm>(EMPTY_PRODUCT_FORM);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    siteName: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
  });

  // Keep settings form in sync
  if (siteSettings && settingsForm.siteName === "") {
    setSettingsForm(siteSettings);
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const openCreate = () => {
    setForm(EMPTY_PRODUCT_FORM);
    setProductDialog({ open: true });
  };

  const openEdit = (product: Product) => {
    setForm(productToForm(product));
    setProductDialog({ open: true, editing: product });
  };

  const handleSaveProduct = async () => {
    if (!form.title || !form.price || !form.amazonUrl) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      if (productDialog.editing) {
        await updateProduct.mutateAsync(
          formToProduct(form, productDialog.editing.id),
        );
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(formToProduct(form, 0n));
        toast.success("Product created!");
      }
      setProductDialog({ open: false });
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteDialog.productId) return;
    try {
      await deleteProduct.mutateAsync(deleteDialog.productId);
      toast.success("Product deleted");
      setDeleteDialog({ open: false });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync(settingsForm);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handleSeedData = async () => {
    try {
      await seedData.mutateAsync();
      toast.success("Sample data seeded!");
    } catch {
      toast.error("Failed to seed data");
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div
          className="bg-card rounded-2xl border border-border shadow-card p-8 max-w-sm w-full text-center"
          data-ocid="admin.panel"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={handleLogin}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div
          className="bg-card rounded-2xl border border-border shadow-card p-8 max-w-sm w-full text-center"
          data-ocid="admin.error_state"
        >
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have admin access to this site.
          </p>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-ocid="admin.secondary_button"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedData}
              disabled={seedData.isPending}
              data-ocid="admin.secondary_button"
            >
              {seedData.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Database className="mr-1.5 h-3.5 w-3.5" />
              )}
              Seed Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.secondary_button"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6" data-ocid="admin.tab">
            <TabsTrigger value="products" data-ocid="admin.tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="settings" data-ocid="admin.tab">
              Site Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Manage Products</h2>
              <Button
                onClick={openCreate}
                className="bg-primary hover:bg-primary/90 text-white rounded-full"
                data-ocid="admin.primary_button"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add Product
              </Button>
            </div>

            {loadingProducts ? (
              <div
                className="flex justify-center py-12"
                data-ocid="admin.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Recommended</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products && products.length > 0 ? (
                      products.map((p, i) => (
                        <TableRow
                          key={String(p.id)}
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell className="font-medium max-w-xs">
                            <div className="line-clamp-2 text-sm">
                              {p.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            ${(Number(p.price) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">{p.rating}★</TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                p.featured
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {p.featured ? "Yes" : "No"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                p.recommended
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {p.recommended ? "Yes" : "No"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEdit(p)}
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    productId: p.id,
                                  })
                                }
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                          data-ocid="admin.empty_state"
                        >
                          No products yet. Click "Add Product" to get started,
                          or use "Seed Data" to add samples.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-card rounded-xl border border-border shadow-card p-6 max-w-xl">
              <h2 className="text-xl font-bold mb-6">Site Settings</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settingsForm.siteName}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                    className="mt-1.5"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settingsForm.heroTitle}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        heroTitle: e.target.value,
                      }))
                    }
                    className="mt-1.5"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={settingsForm.heroSubtitle}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        heroSubtitle: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1.5"
                    data-ocid="admin.textarea"
                  />
                </div>
                <div>
                  <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                  <Input
                    id="heroImageUrl"
                    value={settingsForm.heroImageUrl}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        heroImageUrl: e.target.value,
                      }))
                    }
                    className="mt-1.5"
                    placeholder="https://..."
                    data-ocid="admin.input"
                  />
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full w-fit"
                  data-ocid="admin.save_button"
                >
                  {updateSettings.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog
        open={productDialog.open}
        onOpenChange={(open) => setProductDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {productDialog.editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="sm:col-span-2">
              <Label htmlFor="p-title">Title *</Label>
              <Input
                id="p-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="mt-1"
                data-ocid="admin.textarea"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-img">Image URL</Label>
              <Input
                id="p-img"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label htmlFor="p-price">Price ($) *</Label>
              <Input
                id="p-price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label htmlFor="p-orig">Original Price ($)</Label>
              <Input
                id="p-orig"
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, originalPrice: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label htmlFor="p-rating">Rating (0–5)</Label>
              <Input
                id="p-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label htmlFor="p-reviews">Review Count</Label>
              <Input
                id="p-reviews"
                type="number"
                value={form.reviewCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reviewCount: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-amazon">Amazon URL *</Label>
              <Input
                id="p-amazon"
                value={form.amazonUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amazonUrl: e.target.value }))
                }
                placeholder="https://amazon.com/..."
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label htmlFor="p-cat">Category ID</Label>
              <Input
                id="p-cat"
                type="number"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div className="flex items-center gap-6 pt-5">
              <div className="flex items-center gap-2">
                <Switch
                  id="p-featured"
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, featured: v }))
                  }
                  data-ocid="admin.switch"
                />
                <Label htmlFor="p-featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="p-recommended"
                  checked={form.recommended}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, recommended: v }))
                  }
                  data-ocid="admin.switch"
                />
                <Label htmlFor="p-recommended">Recommended</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialog({ open: false })}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={createProduct.isPending || updateProduct.isPending}
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="admin.save_button"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {productDialog.editing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent data-ocid="admin.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-white hover:bg-destructive/90"
              data-ocid="admin.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
