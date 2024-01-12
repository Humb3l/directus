import { z } from 'zod';

export const RegistrySearchResponsePackage = z.object({
	package: z.object({
		name: z.string(),
		version: z.string(),
		description: z.string().optional(),
		keywords: z.array(z.string()),
		publisher: z.object({
			username: z.string(),
		}),
		maintainers: z.array(
			z.object({
				username: z.string(),
			}),
		),
	}),
});

export type RegistrySearchResponsePackage = z.infer<typeof RegistrySearchResponsePackage>;

export const RegistrySearchResponse = z.object({
	total: z.number(),
	objects: z.array(RegistrySearchResponsePackage),
});

export type RegistrySearchResponse = z.infer<typeof RegistrySearchResponse>;
