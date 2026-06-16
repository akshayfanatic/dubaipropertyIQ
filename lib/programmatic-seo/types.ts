import type { AreaDetail } from '@/lib/db/areas/queries';
import type { BuildingWithRelations } from '@/types/building';
import type { Category } from '@/types/category';
import type { Developer } from '@/types/developer';
import type { Property } from '@/types/property';
import type { AreaRentalYieldTemplate, AreaVsAreaTemplate, BuildingReviewTemplate, DeveloperAreaTemplate, PropertyOffPlanTemplate, PropertyTypeAreaTemplate } from '@/lib/utils/programmatic-seo';

export type PropertyTypeAreaContext = {
  template: PropertyTypeAreaTemplate;
  area: AreaDetail;
  category: Category;
};

export type DeveloperAreaContext = {
  template: DeveloperAreaTemplate;
  area: AreaDetail;
  developer: Developer;
};

export type BuildingReviewContext = {
  template: BuildingReviewTemplate;
  building: BuildingWithRelations;
};

export type PropertyOffPlanContext = {
  template: PropertyOffPlanTemplate;
  property: Property;
};

export type AreaVsAreaContext = {
  template: AreaVsAreaTemplate;
  primaryArea: AreaDetail;
  secondaryArea: AreaDetail;
};

export type AreaRentalYieldContext = {
  template: AreaRentalYieldTemplate;
  area: AreaDetail;
  buildings: BuildingWithRelations[];
};

export type ListingTemplateContext = PropertyTypeAreaContext | DeveloperAreaContext;
export type ProgrammaticSeoContext = ListingTemplateContext | BuildingReviewContext | PropertyOffPlanContext | AreaVsAreaContext | AreaRentalYieldContext;
