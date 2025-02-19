/**
 * A set of types which form the abstract SQL query.
 * It's still neutral to concrete SQL dialects and databases but provides to SQL drivers with a query type that they can more easy work with.
 *
 * How the abstract SQL query types differ from the abstract query.
 * - In the abstract query the user input values are put directly within the query directly.
 * The abstract SQL however stores the user input values in a list of parameters, so that the SQL driver always perform parameterized queries.
 * That way we prevent SQL injection.
 * Moving the user input values into a list of parameters and replace the input value with the index of the value from the list, is a big part of the converter.
 * - Instead of a wrapper for negation, here the negation is a property on the type.
 * So the abstract SQL does not have a node of type 'negate' but instead the nodes have a property called 'negate'.
 *
 * @module
 */
import type { AbstractSqlClauses } from './clauses.js';
import type { ParameterTypes } from './parameterized-statement.js';

/**
 * This is an abstract SQL query which can be passed to all SQL drivers.
 *
 * @example
 * The following query gets the title of all articles and limits the result to 25 rows.
 * ```ts
 * const query: SqlStatement = {
 * 	clauses: {
 *     select: [title],
 *     from: 'articles',
 *     limit: 0, // this is the index of the parameter
 *  },
 * 	parameters: [25],
 * };
 * ```
 */
export interface AbstractSqlQuery {
	/* all clauses each and every driver will use */
	clauses: AbstractSqlClauses;

	/* the parameters which will be passed separately to the database for security reasons  */
	parameters: ParameterTypes[];
}

export type SubQuery = (
	rootRow: Record<string, unknown>,
	columnIndexToIdentifier: (columnIndex: number) => string,
) => {
	rootQuery: AbstractSqlQuery;

	subQueries: SubQuery[];

	aliasMapping: AliasMapping;
};

export type AliasMapping = (
	| { type: 'nested'; alias: string; children: AliasMapping }
	| { type: 'root'; alias: string; columnIndex: number }
	| { type: 'sub'; alias: string; index: number }
)[];

export interface ConverterResult {
	rootQuery: AbstractSqlQuery;

	subQueries: SubQuery[];

	/* a mapping from the result structure to the root or sub query value */
	aliasMapping: AliasMapping;
}
