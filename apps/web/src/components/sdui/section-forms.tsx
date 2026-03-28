import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../../utils/trpc";
import { Field, FieldGroup } from "../field";
import type {
  SectionConfig,
  StoreHeaderConfig,
  HeroBannerConfig,
  CategoryGridConfig,
  ProductCarouselConfig,
  ProductGridConfig,
  TextBlockConfig,
  ImageBannerConfig,
  RelatedByCategoryConfig,
  RelatedByTagConfig,
  RelatedHandPickedConfig,
  RecentlyViewedConfig,
} from "@repo/validators";

// ---------------------------------------------------------------------------
// Per-section config forms
// ---------------------------------------------------------------------------

function StoreHeaderForm({
  value,
  onChange,
}: {
  value: StoreHeaderConfig;
  onChange: (v: StoreHeaderConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Subtitle" description="Optional text below the store name.">
        <input
          value={value.subtitle ?? ""}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value || undefined })}
          placeholder="Browse our collection"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value.showStoreName ?? true}
            onChange={(e) => onChange({ ...value, showStoreName: e.target.checked })}
            className="size-4 rounded border-zinc-300"
          />
          <span className="text-sm/6 text-zinc-950 dark:text-white">Show store name</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value.showLogo ?? true}
            onChange={(e) => onChange({ ...value, showLogo: e.target.checked })}
            className="size-4 rounded border-zinc-300"
          />
          <span className="text-sm/6 text-zinc-950 dark:text-white">Show logo</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value.showSearch ?? false}
            onChange={(e) => onChange({ ...value, showSearch: e.target.checked })}
            className="size-4 rounded border-zinc-300"
          />
          <span className="text-sm/6 text-zinc-950 dark:text-white">Show search bar</span>
        </label>
      </div>
    </FieldGroup>
  );
}

function HeroBannerForm({
  value,
  onChange,
}: {
  value: HeroBannerConfig;
  onChange: (v: HeroBannerConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Image URL">
        <input
          value={value.imageUrl}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          placeholder="https://example.com/banner.jpg"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title (optional)">
          <input
            value={value.title ?? ""}
            onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
            placeholder="Welcome!"
            className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          />
        </Field>
        <Field label="Subtitle (optional)">
          <input
            value={value.subtitle ?? ""}
            onChange={(e) => onChange({ ...value, subtitle: e.target.value || undefined })}
            placeholder="Shop our latest collection"
            className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

function CategoryGridForm({
  value,
  onChange,
  orgId,
}: {
  value: CategoryGridConfig;
  onChange: (v: CategoryGridConfig) => void;
  orgId: string;
}) {
  return (
    <FieldGroup>
      <Field label="Title (optional)">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="Shop by Category"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Max items" description="Leave empty to show all.">
        <input
          type="number"
          min="1"
          max="20"
          value={value.maxItems ?? ""}
          onChange={(e) => onChange({ ...value, maxItems: e.target.value ? Number(e.target.value) : undefined })}
          className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
    </FieldGroup>
  );
}

function ProductCarouselForm({
  value,
  onChange,
  orgId,
}: {
  value: ProductCarouselConfig;
  onChange: (v: ProductCarouselConfig) => void;
  orgId: string;
}) {
  const trpc = useTRPC();
  const { data: categories } = useQuery(trpc.category.list.queryOptions({ orgId }));

  return (
    <FieldGroup>
      <Field label="Section Title">
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          required
          placeholder="New Arrivals"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category filter" description="Show products from a specific category.">
          <select
            value={value.categoryId ?? ""}
            onChange={(e) => onChange({ ...value, categoryId: e.target.value || undefined })}
            className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          >
            <option value="">All products</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Max items">
          <input
            type="number"
            min="1"
            max="20"
            value={value.maxItems ?? 10}
            onChange={(e) => onChange({ ...value, maxItems: Number(e.target.value) || 10 })}
            className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

function ProductGridForm({
  value,
  onChange,
  orgId,
}: {
  value: ProductGridConfig;
  onChange: (v: ProductGridConfig) => void;
  orgId: string;
}) {
  const trpc = useTRPC();
  const { data: categories } = useQuery(trpc.category.list.queryOptions({ orgId }));

  return (
    <FieldGroup>
      <Field label="Title (optional)">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="All Products"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category filter">
          <select
            value={value.categoryId ?? ""}
            onChange={(e) => onChange({ ...value, categoryId: e.target.value || undefined })}
            className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          >
            <option value="">All products</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Max items">
          <input
            type="number"
            min="1"
            max="50"
            value={value.maxItems ?? 10}
            onChange={(e) => onChange({ ...value, maxItems: Number(e.target.value) || 10 })}
            className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

function TextBlockForm({
  value,
  onChange,
}: {
  value: TextBlockConfig;
  onChange: (v: TextBlockConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Title (optional)">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="About Us"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Body">
        <textarea
          value={value.body}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
          rows={4}
          placeholder="Write your content here..."
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
    </FieldGroup>
  );
}

function ImageBannerForm({
  value,
  onChange,
}: {
  value: ImageBannerConfig;
  onChange: (v: ImageBannerConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Image URL">
        <input
          value={value.imageUrl}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          placeholder="https://example.com/promo.jpg"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Alt text (optional)">
        <input
          value={value.alt ?? ""}
          onChange={(e) => onChange({ ...value, alt: e.target.value || undefined })}
          placeholder="Spring sale banner"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
    </FieldGroup>
  );
}

// ---------------------------------------------------------------------------
// Product page section forms
// ---------------------------------------------------------------------------

function RelatedByCategoryForm({
  value,
  onChange,
}: {
  value: RelatedByCategoryConfig;
  onChange: (v: RelatedByCategoryConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Title" description="e.g. 'More from this category'">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="More from this category"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Max items">
        <input type="number" min="1" max="20" value={value.maxItems ?? 8} onChange={(e) => onChange({ ...value, maxItems: Number(e.target.value) || 8 })} className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
      </Field>
    </FieldGroup>
  );
}

function RelatedByTagForm({
  value,
  onChange,
}: {
  value: RelatedByTagConfig;
  onChange: (v: RelatedByTagConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Title">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="More from this brand"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Tag / Brand" description="Products matching this keyword in name or slug.">
        <input
          value={value.tag}
          onChange={(e) => onChange({ ...value, tag: e.target.value })}
          required
          placeholder="nike"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Max items">
        <input type="number" min="1" max="20" value={value.maxItems ?? 8} onChange={(e) => onChange({ ...value, maxItems: Number(e.target.value) || 8 })} className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
      </Field>
    </FieldGroup>
  );
}

function RelatedHandPickedForm({
  value,
  onChange,
}: {
  value: RelatedHandPickedConfig;
  onChange: (v: RelatedHandPickedConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Title">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="You may also like"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Product Slugs" description="Comma-separated product slugs to display.">
        <input
          value={(value.productSlugs ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              ...value,
              productSlugs: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="classic-tee, summer-shorts, sneakers"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
    </FieldGroup>
  );
}

function RecentlyViewedForm({
  value,
  onChange,
}: {
  value: RecentlyViewedConfig;
  onChange: (v: RecentlyViewedConfig) => void;
}) {
  return (
    <FieldGroup>
      <Field label="Title">
        <input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
          placeholder="Recently viewed"
          className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        />
      </Field>
      <Field label="Max items">
        <input type="number" min="1" max="20" value={value.maxItems ?? 10} onChange={(e) => onChange({ ...value, maxItems: Number(e.target.value) || 10 })} className="w-32 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
      </Field>
    </FieldGroup>
  );
}

// ---------------------------------------------------------------------------
// Exhaustive form dispatcher
// ---------------------------------------------------------------------------

type FormProps<T extends SectionConfig = SectionConfig> = {
  value: T;
  onChange: (v: T) => void;
  orgId: string;
};

const SECTION_FORMS: {
  [K in SectionConfig["type"]]: React.ComponentType<
    FormProps<Extract<SectionConfig, { type: K }>>
  >;
} = {
  "store-header": StoreHeaderForm as any,
  "hero-banner": HeroBannerForm as any,
  "category-grid": CategoryGridForm as any,
  "product-carousel": ProductCarouselForm as any,
  "product-grid": ProductGridForm as any,
  "text-block": TextBlockForm as any,
  "image-banner": ImageBannerForm as any,
  "related-by-category": RelatedByCategoryForm as any,
  "related-by-tag": RelatedByTagForm as any,
  "related-hand-picked": RelatedHandPickedForm as any,
  "recently-viewed": RecentlyViewedForm as any,
};

export function SectionConfigForm({
  value,
  onChange,
  orgId,
}: {
  value: SectionConfig;
  onChange: (v: SectionConfig) => void;
  orgId: string;
}) {
  const Form = SECTION_FORMS[value.type] as React.ComponentType<FormProps>;
  return <Form value={value} onChange={onChange} orgId={orgId} />;
}
