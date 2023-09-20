/**
 * To use when typing discriminator values for class-transformer
 */
export interface DiscriminatedType<C, N> {
	name: N;
	value: C;
}
