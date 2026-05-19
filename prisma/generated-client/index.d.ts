
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Artist
 * 
 */
export type Artist = $Result.DefaultSelection<Prisma.$ArtistPayload>
/**
 * Model Lead
 * 
 */
export type Lead = $Result.DefaultSelection<Prisma.$LeadPayload>
/**
 * Model Release
 * 
 */
export type Release = $Result.DefaultSelection<Prisma.$ReleasePayload>
/**
 * Model InstagramPost
 * 
 */
export type InstagramPost = $Result.DefaultSelection<Prisma.$InstagramPostPayload>
/**
 * Model MessageDraft
 * 
 */
export type MessageDraft = $Result.DefaultSelection<Prisma.$MessageDraftPayload>
/**
 * Model Activity
 * 
 */
export type Activity = $Result.DefaultSelection<Prisma.$ActivityPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model ProjectFeedback
 * 
 */
export type ProjectFeedback = $Result.DefaultSelection<Prisma.$ProjectFeedbackPayload>
/**
 * Model ProjectInvoice
 * 
 */
export type ProjectInvoice = $Result.DefaultSelection<Prisma.$ProjectInvoicePayload>
/**
 * Model AgentRun
 * 
 */
export type AgentRun = $Result.DefaultSelection<Prisma.$AgentRunPayload>
/**
 * Model ContactInfo
 * 
 */
export type ContactInfo = $Result.DefaultSelection<Prisma.$ContactInfoPayload>
/**
 * Model MergeProposal
 * 
 */
export type MergeProposal = $Result.DefaultSelection<Prisma.$MergeProposalPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LeadStatus: {
  NEW: 'NEW',
  QUALIFIED: 'QUALIFIED',
  CONTACTED: 'CONTACTED',
  FOLLOW_UP: 'FOLLOW_UP',
  WON: 'WON',
  LOST: 'LOST'
};

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus]


export const ActivityType: {
  MESSAGE_SENT: 'MESSAGE_SENT',
  REPLY_RECEIVED: 'REPLY_RECEIVED',
  FOLLOW_UP_SET: 'FOLLOW_UP_SET',
  STATUS_CHANGE: 'STATUS_CHANGE',
  NOTE: 'NOTE'
};

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]


export const ProjectStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const FileType: {
  WORKING: 'WORKING',
  DELIVERABLE: 'DELIVERABLE'
};

export type FileType = (typeof FileType)[keyof typeof FileType]

}

export type LeadStatus = $Enums.LeadStatus

export const LeadStatus: typeof $Enums.LeadStatus

export type ActivityType = $Enums.ActivityType

export const ActivityType: typeof $Enums.ActivityType

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type FileType = $Enums.FileType

export const FileType: typeof $Enums.FileType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Artists
 * const artists = await prisma.artist.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Artists
   * const artists = await prisma.artist.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.artist`: Exposes CRUD operations for the **Artist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Artists
    * const artists = await prisma.artist.findMany()
    * ```
    */
  get artist(): Prisma.ArtistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leads
    * const leads = await prisma.lead.findMany()
    * ```
    */
  get lead(): Prisma.LeadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.release`: Exposes CRUD operations for the **Release** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Releases
    * const releases = await prisma.release.findMany()
    * ```
    */
  get release(): Prisma.ReleaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.instagramPost`: Exposes CRUD operations for the **InstagramPost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InstagramPosts
    * const instagramPosts = await prisma.instagramPost.findMany()
    * ```
    */
  get instagramPost(): Prisma.InstagramPostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messageDraft`: Exposes CRUD operations for the **MessageDraft** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MessageDrafts
    * const messageDrafts = await prisma.messageDraft.findMany()
    * ```
    */
  get messageDraft(): Prisma.MessageDraftDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.activity`: Exposes CRUD operations for the **Activity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Activities
    * const activities = await prisma.activity.findMany()
    * ```
    */
  get activity(): Prisma.ActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFeedback`: Exposes CRUD operations for the **ProjectFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFeedbacks
    * const projectFeedbacks = await prisma.projectFeedback.findMany()
    * ```
    */
  get projectFeedback(): Prisma.ProjectFeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectInvoice`: Exposes CRUD operations for the **ProjectInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectInvoices
    * const projectInvoices = await prisma.projectInvoice.findMany()
    * ```
    */
  get projectInvoice(): Prisma.ProjectInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentRun`: Exposes CRUD operations for the **AgentRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentRuns
    * const agentRuns = await prisma.agentRun.findMany()
    * ```
    */
  get agentRun(): Prisma.AgentRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contactInfo`: Exposes CRUD operations for the **ContactInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactInfos
    * const contactInfos = await prisma.contactInfo.findMany()
    * ```
    */
  get contactInfo(): Prisma.ContactInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mergeProposal`: Exposes CRUD operations for the **MergeProposal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MergeProposals
    * const mergeProposals = await prisma.mergeProposal.findMany()
    * ```
    */
  get mergeProposal(): Prisma.MergeProposalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Artist: 'Artist',
    Lead: 'Lead',
    Release: 'Release',
    InstagramPost: 'InstagramPost',
    MessageDraft: 'MessageDraft',
    Activity: 'Activity',
    Project: 'Project',
    ProjectFile: 'ProjectFile',
    ProjectFeedback: 'ProjectFeedback',
    ProjectInvoice: 'ProjectInvoice',
    AgentRun: 'AgentRun',
    ContactInfo: 'ContactInfo',
    MergeProposal: 'MergeProposal'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "artist" | "lead" | "release" | "instagramPost" | "messageDraft" | "activity" | "project" | "projectFile" | "projectFeedback" | "projectInvoice" | "agentRun" | "contactInfo" | "mergeProposal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Artist: {
        payload: Prisma.$ArtistPayload<ExtArgs>
        fields: Prisma.ArtistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArtistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArtistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          findFirst: {
            args: Prisma.ArtistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArtistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          findMany: {
            args: Prisma.ArtistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>[]
          }
          create: {
            args: Prisma.ArtistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          createMany: {
            args: Prisma.ArtistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArtistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>[]
          }
          delete: {
            args: Prisma.ArtistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          update: {
            args: Prisma.ArtistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          deleteMany: {
            args: Prisma.ArtistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArtistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArtistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>[]
          }
          upsert: {
            args: Prisma.ArtistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistPayload>
          }
          aggregate: {
            args: Prisma.ArtistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArtist>
          }
          groupBy: {
            args: Prisma.ArtistGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArtistGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArtistCountArgs<ExtArgs>
            result: $Utils.Optional<ArtistCountAggregateOutputType> | number
          }
        }
      }
      Lead: {
        payload: Prisma.$LeadPayload<ExtArgs>
        fields: Prisma.LeadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findFirst: {
            args: Prisma.LeadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findMany: {
            args: Prisma.LeadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          create: {
            args: Prisma.LeadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          createMany: {
            args: Prisma.LeadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          delete: {
            args: Prisma.LeadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          update: {
            args: Prisma.LeadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          deleteMany: {
            args: Prisma.LeadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          upsert: {
            args: Prisma.LeadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          aggregate: {
            args: Prisma.LeadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLead>
          }
          groupBy: {
            args: Prisma.LeadGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadCountArgs<ExtArgs>
            result: $Utils.Optional<LeadCountAggregateOutputType> | number
          }
        }
      }
      Release: {
        payload: Prisma.$ReleasePayload<ExtArgs>
        fields: Prisma.ReleaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReleaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReleaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          findFirst: {
            args: Prisma.ReleaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReleaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          findMany: {
            args: Prisma.ReleaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>[]
          }
          create: {
            args: Prisma.ReleaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          createMany: {
            args: Prisma.ReleaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReleaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>[]
          }
          delete: {
            args: Prisma.ReleaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          update: {
            args: Prisma.ReleaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          deleteMany: {
            args: Prisma.ReleaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReleaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReleaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>[]
          }
          upsert: {
            args: Prisma.ReleaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReleasePayload>
          }
          aggregate: {
            args: Prisma.ReleaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelease>
          }
          groupBy: {
            args: Prisma.ReleaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReleaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReleaseCountArgs<ExtArgs>
            result: $Utils.Optional<ReleaseCountAggregateOutputType> | number
          }
        }
      }
      InstagramPost: {
        payload: Prisma.$InstagramPostPayload<ExtArgs>
        fields: Prisma.InstagramPostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstagramPostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstagramPostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          findFirst: {
            args: Prisma.InstagramPostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstagramPostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          findMany: {
            args: Prisma.InstagramPostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>[]
          }
          create: {
            args: Prisma.InstagramPostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          createMany: {
            args: Prisma.InstagramPostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstagramPostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>[]
          }
          delete: {
            args: Prisma.InstagramPostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          update: {
            args: Prisma.InstagramPostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          deleteMany: {
            args: Prisma.InstagramPostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstagramPostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstagramPostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>[]
          }
          upsert: {
            args: Prisma.InstagramPostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstagramPostPayload>
          }
          aggregate: {
            args: Prisma.InstagramPostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstagramPost>
          }
          groupBy: {
            args: Prisma.InstagramPostGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstagramPostGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstagramPostCountArgs<ExtArgs>
            result: $Utils.Optional<InstagramPostCountAggregateOutputType> | number
          }
        }
      }
      MessageDraft: {
        payload: Prisma.$MessageDraftPayload<ExtArgs>
        fields: Prisma.MessageDraftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageDraftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageDraftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          findFirst: {
            args: Prisma.MessageDraftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageDraftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          findMany: {
            args: Prisma.MessageDraftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>[]
          }
          create: {
            args: Prisma.MessageDraftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          createMany: {
            args: Prisma.MessageDraftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageDraftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>[]
          }
          delete: {
            args: Prisma.MessageDraftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          update: {
            args: Prisma.MessageDraftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          deleteMany: {
            args: Prisma.MessageDraftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageDraftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageDraftUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>[]
          }
          upsert: {
            args: Prisma.MessageDraftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageDraftPayload>
          }
          aggregate: {
            args: Prisma.MessageDraftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessageDraft>
          }
          groupBy: {
            args: Prisma.MessageDraftGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageDraftGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageDraftCountArgs<ExtArgs>
            result: $Utils.Optional<MessageDraftCountAggregateOutputType> | number
          }
        }
      }
      Activity: {
        payload: Prisma.$ActivityPayload<ExtArgs>
        fields: Prisma.ActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          findFirst: {
            args: Prisma.ActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          findMany: {
            args: Prisma.ActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          create: {
            args: Prisma.ActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          createMany: {
            args: Prisma.ActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          delete: {
            args: Prisma.ActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          update: {
            args: Prisma.ActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          deleteMany: {
            args: Prisma.ActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          upsert: {
            args: Prisma.ActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          aggregate: {
            args: Prisma.ActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivity>
          }
          groupBy: {
            args: Prisma.ActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivityCountArgs<ExtArgs>
            result: $Utils.Optional<ActivityCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      ProjectFeedback: {
        payload: Prisma.$ProjectFeedbackPayload<ExtArgs>
        fields: Prisma.ProjectFeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          findFirst: {
            args: Prisma.ProjectFeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          findMany: {
            args: Prisma.ProjectFeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>[]
          }
          create: {
            args: Prisma.ProjectFeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          createMany: {
            args: Prisma.ProjectFeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>[]
          }
          delete: {
            args: Prisma.ProjectFeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          update: {
            args: Prisma.ProjectFeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          deleteMany: {
            args: Prisma.ProjectFeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>[]
          }
          upsert: {
            args: Prisma.ProjectFeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFeedbackPayload>
          }
          aggregate: {
            args: Prisma.ProjectFeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFeedback>
          }
          groupBy: {
            args: Prisma.ProjectFeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFeedbackCountAggregateOutputType> | number
          }
        }
      }
      ProjectInvoice: {
        payload: Prisma.$ProjectInvoicePayload<ExtArgs>
        fields: Prisma.ProjectInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          findFirst: {
            args: Prisma.ProjectInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          findMany: {
            args: Prisma.ProjectInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>[]
          }
          create: {
            args: Prisma.ProjectInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          createMany: {
            args: Prisma.ProjectInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>[]
          }
          delete: {
            args: Prisma.ProjectInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          update: {
            args: Prisma.ProjectInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          deleteMany: {
            args: Prisma.ProjectInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>[]
          }
          upsert: {
            args: Prisma.ProjectInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectInvoicePayload>
          }
          aggregate: {
            args: Prisma.ProjectInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectInvoice>
          }
          groupBy: {
            args: Prisma.ProjectInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectInvoiceCountAggregateOutputType> | number
          }
        }
      }
      AgentRun: {
        payload: Prisma.$AgentRunPayload<ExtArgs>
        fields: Prisma.AgentRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findFirst: {
            args: Prisma.AgentRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findMany: {
            args: Prisma.AgentRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          create: {
            args: Prisma.AgentRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          createMany: {
            args: Prisma.AgentRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          delete: {
            args: Prisma.AgentRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          update: {
            args: Prisma.AgentRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          deleteMany: {
            args: Prisma.AgentRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          upsert: {
            args: Prisma.AgentRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          aggregate: {
            args: Prisma.AgentRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentRun>
          }
          groupBy: {
            args: Prisma.AgentRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentRunCountArgs<ExtArgs>
            result: $Utils.Optional<AgentRunCountAggregateOutputType> | number
          }
        }
      }
      ContactInfo: {
        payload: Prisma.$ContactInfoPayload<ExtArgs>
        fields: Prisma.ContactInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          findFirst: {
            args: Prisma.ContactInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          findMany: {
            args: Prisma.ContactInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>[]
          }
          create: {
            args: Prisma.ContactInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          createMany: {
            args: Prisma.ContactInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>[]
          }
          delete: {
            args: Prisma.ContactInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          update: {
            args: Prisma.ContactInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          deleteMany: {
            args: Prisma.ContactInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>[]
          }
          upsert: {
            args: Prisma.ContactInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          aggregate: {
            args: Prisma.ContactInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactInfo>
          }
          groupBy: {
            args: Prisma.ContactInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactInfoCountArgs<ExtArgs>
            result: $Utils.Optional<ContactInfoCountAggregateOutputType> | number
          }
        }
      }
      MergeProposal: {
        payload: Prisma.$MergeProposalPayload<ExtArgs>
        fields: Prisma.MergeProposalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MergeProposalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MergeProposalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          findFirst: {
            args: Prisma.MergeProposalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MergeProposalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          findMany: {
            args: Prisma.MergeProposalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>[]
          }
          create: {
            args: Prisma.MergeProposalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          createMany: {
            args: Prisma.MergeProposalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MergeProposalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>[]
          }
          delete: {
            args: Prisma.MergeProposalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          update: {
            args: Prisma.MergeProposalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          deleteMany: {
            args: Prisma.MergeProposalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MergeProposalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MergeProposalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>[]
          }
          upsert: {
            args: Prisma.MergeProposalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MergeProposalPayload>
          }
          aggregate: {
            args: Prisma.MergeProposalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMergeProposal>
          }
          groupBy: {
            args: Prisma.MergeProposalGroupByArgs<ExtArgs>
            result: $Utils.Optional<MergeProposalGroupByOutputType>[]
          }
          count: {
            args: Prisma.MergeProposalCountArgs<ExtArgs>
            result: $Utils.Optional<MergeProposalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    artist?: ArtistOmit
    lead?: LeadOmit
    release?: ReleaseOmit
    instagramPost?: InstagramPostOmit
    messageDraft?: MessageDraftOmit
    activity?: ActivityOmit
    project?: ProjectOmit
    projectFile?: ProjectFileOmit
    projectFeedback?: ProjectFeedbackOmit
    projectInvoice?: ProjectInvoiceOmit
    agentRun?: AgentRunOmit
    contactInfo?: ContactInfoOmit
    mergeProposal?: MergeProposalOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ArtistCountOutputType
   */

  export type ArtistCountOutputType = {
    leads: number
    releases: number
    instagramPosts: number
    projects: number
    contactInfos: number
    primaryMerges: number
    duplicateMerges: number
  }

  export type ArtistCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | ArtistCountOutputTypeCountLeadsArgs
    releases?: boolean | ArtistCountOutputTypeCountReleasesArgs
    instagramPosts?: boolean | ArtistCountOutputTypeCountInstagramPostsArgs
    projects?: boolean | ArtistCountOutputTypeCountProjectsArgs
    contactInfos?: boolean | ArtistCountOutputTypeCountContactInfosArgs
    primaryMerges?: boolean | ArtistCountOutputTypeCountPrimaryMergesArgs
    duplicateMerges?: boolean | ArtistCountOutputTypeCountDuplicateMergesArgs
  }

  // Custom InputTypes
  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArtistCountOutputType
     */
    select?: ArtistCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountLeadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReleaseWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountInstagramPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstagramPostWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountContactInfosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactInfoWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountPrimaryMergesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MergeProposalWhereInput
  }

  /**
   * ArtistCountOutputType without action
   */
  export type ArtistCountOutputTypeCountDuplicateMergesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MergeProposalWhereInput
  }


  /**
   * Count Type LeadCountOutputType
   */

  export type LeadCountOutputType = {
    messages: number
    activities: number
  }

  export type LeadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | LeadCountOutputTypeCountMessagesArgs
    activities?: boolean | LeadCountOutputTypeCountActivitiesArgs
  }

  // Custom InputTypes
  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadCountOutputType
     */
    select?: LeadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageDraftWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    files: number
    feedbacks: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
    feedbacks?: boolean | ProjectCountOutputTypeCountFeedbacksArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFeedbackWhereInput
  }


  /**
   * Count Type ProjectFileCountOutputType
   */

  export type ProjectFileCountOutputType = {
    feedbacks: number
  }

  export type ProjectFileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | ProjectFileCountOutputTypeCountFeedbacksArgs
  }

  // Custom InputTypes
  /**
   * ProjectFileCountOutputType without action
   */
  export type ProjectFileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFileCountOutputType
     */
    select?: ProjectFileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectFileCountOutputType without action
   */
  export type ProjectFileCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFeedbackWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Artist
   */

  export type AggregateArtist = {
    _count: ArtistCountAggregateOutputType | null
    _avg: ArtistAvgAggregateOutputType | null
    _sum: ArtistSumAggregateOutputType | null
    _min: ArtistMinAggregateOutputType | null
    _max: ArtistMaxAggregateOutputType | null
  }

  export type ArtistAvgAggregateOutputType = {
    followerCount: number | null
  }

  export type ArtistSumAggregateOutputType = {
    followerCount: number | null
  }

  export type ArtistMinAggregateOutputType = {
    id: string | null
    name: string | null
    instagramHandle: string | null
    instagramProfileUrl: string | null
    instagramProfileImageUrl: string | null
    spotifyArtistId: string | null
    spotifyArtistUrl: string | null
    spotifyImageUrl: string | null
    spotifyAccent: string | null
    spotifyAccentStrong: string | null
    spotifyHighlight: string | null
    officialSiteUrl: string | null
    location: string | null
    city: string | null
    state: string | null
    country: string | null
    genre: string | null
    bio: string | null
    followerCount: number | null
    lastPostAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArtistMaxAggregateOutputType = {
    id: string | null
    name: string | null
    instagramHandle: string | null
    instagramProfileUrl: string | null
    instagramProfileImageUrl: string | null
    spotifyArtistId: string | null
    spotifyArtistUrl: string | null
    spotifyImageUrl: string | null
    spotifyAccent: string | null
    spotifyAccentStrong: string | null
    spotifyHighlight: string | null
    officialSiteUrl: string | null
    location: string | null
    city: string | null
    state: string | null
    country: string | null
    genre: string | null
    bio: string | null
    followerCount: number | null
    lastPostAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArtistCountAggregateOutputType = {
    id: number
    name: number
    instagramHandle: number
    instagramProfileUrl: number
    instagramProfileImageUrl: number
    spotifyArtistId: number
    spotifyArtistUrl: number
    spotifyImageUrl: number
    spotifyAccent: number
    spotifyAccentStrong: number
    spotifyHighlight: number
    officialSiteUrl: number
    location: number
    city: number
    state: number
    country: number
    genre: number
    tags: number
    bio: number
    emails: number
    followerCount: number
    lastPostAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArtistAvgAggregateInputType = {
    followerCount?: true
  }

  export type ArtistSumAggregateInputType = {
    followerCount?: true
  }

  export type ArtistMinAggregateInputType = {
    id?: true
    name?: true
    instagramHandle?: true
    instagramProfileUrl?: true
    instagramProfileImageUrl?: true
    spotifyArtistId?: true
    spotifyArtistUrl?: true
    spotifyImageUrl?: true
    spotifyAccent?: true
    spotifyAccentStrong?: true
    spotifyHighlight?: true
    officialSiteUrl?: true
    location?: true
    city?: true
    state?: true
    country?: true
    genre?: true
    bio?: true
    followerCount?: true
    lastPostAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArtistMaxAggregateInputType = {
    id?: true
    name?: true
    instagramHandle?: true
    instagramProfileUrl?: true
    instagramProfileImageUrl?: true
    spotifyArtistId?: true
    spotifyArtistUrl?: true
    spotifyImageUrl?: true
    spotifyAccent?: true
    spotifyAccentStrong?: true
    spotifyHighlight?: true
    officialSiteUrl?: true
    location?: true
    city?: true
    state?: true
    country?: true
    genre?: true
    bio?: true
    followerCount?: true
    lastPostAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArtistCountAggregateInputType = {
    id?: true
    name?: true
    instagramHandle?: true
    instagramProfileUrl?: true
    instagramProfileImageUrl?: true
    spotifyArtistId?: true
    spotifyArtistUrl?: true
    spotifyImageUrl?: true
    spotifyAccent?: true
    spotifyAccentStrong?: true
    spotifyHighlight?: true
    officialSiteUrl?: true
    location?: true
    city?: true
    state?: true
    country?: true
    genre?: true
    tags?: true
    bio?: true
    emails?: true
    followerCount?: true
    lastPostAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArtistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Artist to aggregate.
     */
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistOrderByWithRelationInput | ArtistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Artists
    **/
    _count?: true | ArtistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArtistAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArtistSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArtistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArtistMaxAggregateInputType
  }

  export type GetArtistAggregateType<T extends ArtistAggregateArgs> = {
        [P in keyof T & keyof AggregateArtist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArtist[P]>
      : GetScalarType<T[P], AggregateArtist[P]>
  }




  export type ArtistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArtistWhereInput
    orderBy?: ArtistOrderByWithAggregationInput | ArtistOrderByWithAggregationInput[]
    by: ArtistScalarFieldEnum[] | ArtistScalarFieldEnum
    having?: ArtistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArtistCountAggregateInputType | true
    _avg?: ArtistAvgAggregateInputType
    _sum?: ArtistSumAggregateInputType
    _min?: ArtistMinAggregateInputType
    _max?: ArtistMaxAggregateInputType
  }

  export type ArtistGroupByOutputType = {
    id: string
    name: string
    instagramHandle: string | null
    instagramProfileUrl: string | null
    instagramProfileImageUrl: string | null
    spotifyArtistId: string | null
    spotifyArtistUrl: string | null
    spotifyImageUrl: string | null
    spotifyAccent: string | null
    spotifyAccentStrong: string | null
    spotifyHighlight: string | null
    officialSiteUrl: string | null
    location: string | null
    city: string | null
    state: string | null
    country: string | null
    genre: string | null
    tags: string[]
    bio: string | null
    emails: string[]
    followerCount: number | null
    lastPostAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ArtistCountAggregateOutputType | null
    _avg: ArtistAvgAggregateOutputType | null
    _sum: ArtistSumAggregateOutputType | null
    _min: ArtistMinAggregateOutputType | null
    _max: ArtistMaxAggregateOutputType | null
  }

  type GetArtistGroupByPayload<T extends ArtistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArtistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArtistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArtistGroupByOutputType[P]>
            : GetScalarType<T[P], ArtistGroupByOutputType[P]>
        }
      >
    >


  export type ArtistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    instagramHandle?: boolean
    instagramProfileUrl?: boolean
    instagramProfileImageUrl?: boolean
    spotifyArtistId?: boolean
    spotifyArtistUrl?: boolean
    spotifyImageUrl?: boolean
    spotifyAccent?: boolean
    spotifyAccentStrong?: boolean
    spotifyHighlight?: boolean
    officialSiteUrl?: boolean
    location?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    genre?: boolean
    tags?: boolean
    bio?: boolean
    emails?: boolean
    followerCount?: boolean
    lastPostAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    leads?: boolean | Artist$leadsArgs<ExtArgs>
    releases?: boolean | Artist$releasesArgs<ExtArgs>
    instagramPosts?: boolean | Artist$instagramPostsArgs<ExtArgs>
    projects?: boolean | Artist$projectsArgs<ExtArgs>
    contactInfos?: boolean | Artist$contactInfosArgs<ExtArgs>
    primaryMerges?: boolean | Artist$primaryMergesArgs<ExtArgs>
    duplicateMerges?: boolean | Artist$duplicateMergesArgs<ExtArgs>
    _count?: boolean | ArtistCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["artist"]>

  export type ArtistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    instagramHandle?: boolean
    instagramProfileUrl?: boolean
    instagramProfileImageUrl?: boolean
    spotifyArtistId?: boolean
    spotifyArtistUrl?: boolean
    spotifyImageUrl?: boolean
    spotifyAccent?: boolean
    spotifyAccentStrong?: boolean
    spotifyHighlight?: boolean
    officialSiteUrl?: boolean
    location?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    genre?: boolean
    tags?: boolean
    bio?: boolean
    emails?: boolean
    followerCount?: boolean
    lastPostAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["artist"]>

  export type ArtistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    instagramHandle?: boolean
    instagramProfileUrl?: boolean
    instagramProfileImageUrl?: boolean
    spotifyArtistId?: boolean
    spotifyArtistUrl?: boolean
    spotifyImageUrl?: boolean
    spotifyAccent?: boolean
    spotifyAccentStrong?: boolean
    spotifyHighlight?: boolean
    officialSiteUrl?: boolean
    location?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    genre?: boolean
    tags?: boolean
    bio?: boolean
    emails?: boolean
    followerCount?: boolean
    lastPostAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["artist"]>

  export type ArtistSelectScalar = {
    id?: boolean
    name?: boolean
    instagramHandle?: boolean
    instagramProfileUrl?: boolean
    instagramProfileImageUrl?: boolean
    spotifyArtistId?: boolean
    spotifyArtistUrl?: boolean
    spotifyImageUrl?: boolean
    spotifyAccent?: boolean
    spotifyAccentStrong?: boolean
    spotifyHighlight?: boolean
    officialSiteUrl?: boolean
    location?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    genre?: boolean
    tags?: boolean
    bio?: boolean
    emails?: boolean
    followerCount?: boolean
    lastPostAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArtistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "instagramHandle" | "instagramProfileUrl" | "instagramProfileImageUrl" | "spotifyArtistId" | "spotifyArtistUrl" | "spotifyImageUrl" | "spotifyAccent" | "spotifyAccentStrong" | "spotifyHighlight" | "officialSiteUrl" | "location" | "city" | "state" | "country" | "genre" | "tags" | "bio" | "emails" | "followerCount" | "lastPostAt" | "createdAt" | "updatedAt", ExtArgs["result"]["artist"]>
  export type ArtistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | Artist$leadsArgs<ExtArgs>
    releases?: boolean | Artist$releasesArgs<ExtArgs>
    instagramPosts?: boolean | Artist$instagramPostsArgs<ExtArgs>
    projects?: boolean | Artist$projectsArgs<ExtArgs>
    contactInfos?: boolean | Artist$contactInfosArgs<ExtArgs>
    primaryMerges?: boolean | Artist$primaryMergesArgs<ExtArgs>
    duplicateMerges?: boolean | Artist$duplicateMergesArgs<ExtArgs>
    _count?: boolean | ArtistCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArtistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ArtistIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ArtistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Artist"
    objects: {
      leads: Prisma.$LeadPayload<ExtArgs>[]
      releases: Prisma.$ReleasePayload<ExtArgs>[]
      instagramPosts: Prisma.$InstagramPostPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      contactInfos: Prisma.$ContactInfoPayload<ExtArgs>[]
      primaryMerges: Prisma.$MergeProposalPayload<ExtArgs>[]
      duplicateMerges: Prisma.$MergeProposalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      instagramHandle: string | null
      instagramProfileUrl: string | null
      instagramProfileImageUrl: string | null
      spotifyArtistId: string | null
      spotifyArtistUrl: string | null
      spotifyImageUrl: string | null
      spotifyAccent: string | null
      spotifyAccentStrong: string | null
      spotifyHighlight: string | null
      officialSiteUrl: string | null
      location: string | null
      city: string | null
      state: string | null
      country: string | null
      genre: string | null
      tags: string[]
      bio: string | null
      emails: string[]
      followerCount: number | null
      lastPostAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["artist"]>
    composites: {}
  }

  type ArtistGetPayload<S extends boolean | null | undefined | ArtistDefaultArgs> = $Result.GetResult<Prisma.$ArtistPayload, S>

  type ArtistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArtistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArtistCountAggregateInputType | true
    }

  export interface ArtistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Artist'], meta: { name: 'Artist' } }
    /**
     * Find zero or one Artist that matches the filter.
     * @param {ArtistFindUniqueArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArtistFindUniqueArgs>(args: SelectSubset<T, ArtistFindUniqueArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Artist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArtistFindUniqueOrThrowArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArtistFindUniqueOrThrowArgs>(args: SelectSubset<T, ArtistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Artist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindFirstArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArtistFindFirstArgs>(args?: SelectSubset<T, ArtistFindFirstArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Artist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindFirstOrThrowArgs} args - Arguments to find a Artist
     * @example
     * // Get one Artist
     * const artist = await prisma.artist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArtistFindFirstOrThrowArgs>(args?: SelectSubset<T, ArtistFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Artists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Artists
     * const artists = await prisma.artist.findMany()
     * 
     * // Get first 10 Artists
     * const artists = await prisma.artist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const artistWithIdOnly = await prisma.artist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArtistFindManyArgs>(args?: SelectSubset<T, ArtistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Artist.
     * @param {ArtistCreateArgs} args - Arguments to create a Artist.
     * @example
     * // Create one Artist
     * const Artist = await prisma.artist.create({
     *   data: {
     *     // ... data to create a Artist
     *   }
     * })
     * 
     */
    create<T extends ArtistCreateArgs>(args: SelectSubset<T, ArtistCreateArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Artists.
     * @param {ArtistCreateManyArgs} args - Arguments to create many Artists.
     * @example
     * // Create many Artists
     * const artist = await prisma.artist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArtistCreateManyArgs>(args?: SelectSubset<T, ArtistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Artists and returns the data saved in the database.
     * @param {ArtistCreateManyAndReturnArgs} args - Arguments to create many Artists.
     * @example
     * // Create many Artists
     * const artist = await prisma.artist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Artists and only return the `id`
     * const artistWithIdOnly = await prisma.artist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArtistCreateManyAndReturnArgs>(args?: SelectSubset<T, ArtistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Artist.
     * @param {ArtistDeleteArgs} args - Arguments to delete one Artist.
     * @example
     * // Delete one Artist
     * const Artist = await prisma.artist.delete({
     *   where: {
     *     // ... filter to delete one Artist
     *   }
     * })
     * 
     */
    delete<T extends ArtistDeleteArgs>(args: SelectSubset<T, ArtistDeleteArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Artist.
     * @param {ArtistUpdateArgs} args - Arguments to update one Artist.
     * @example
     * // Update one Artist
     * const artist = await prisma.artist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArtistUpdateArgs>(args: SelectSubset<T, ArtistUpdateArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Artists.
     * @param {ArtistDeleteManyArgs} args - Arguments to filter Artists to delete.
     * @example
     * // Delete a few Artists
     * const { count } = await prisma.artist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArtistDeleteManyArgs>(args?: SelectSubset<T, ArtistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Artists
     * const artist = await prisma.artist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArtistUpdateManyArgs>(args: SelectSubset<T, ArtistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Artists and returns the data updated in the database.
     * @param {ArtistUpdateManyAndReturnArgs} args - Arguments to update many Artists.
     * @example
     * // Update many Artists
     * const artist = await prisma.artist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Artists and only return the `id`
     * const artistWithIdOnly = await prisma.artist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArtistUpdateManyAndReturnArgs>(args: SelectSubset<T, ArtistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Artist.
     * @param {ArtistUpsertArgs} args - Arguments to update or create a Artist.
     * @example
     * // Update or create a Artist
     * const artist = await prisma.artist.upsert({
     *   create: {
     *     // ... data to create a Artist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Artist we want to update
     *   }
     * })
     */
    upsert<T extends ArtistUpsertArgs>(args: SelectSubset<T, ArtistUpsertArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistCountArgs} args - Arguments to filter Artists to count.
     * @example
     * // Count the number of Artists
     * const count = await prisma.artist.count({
     *   where: {
     *     // ... the filter for the Artists we want to count
     *   }
     * })
    **/
    count<T extends ArtistCountArgs>(
      args?: Subset<T, ArtistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArtistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArtistAggregateArgs>(args: Subset<T, ArtistAggregateArgs>): Prisma.PrismaPromise<GetArtistAggregateType<T>>

    /**
     * Group by Artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArtistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArtistGroupByArgs['orderBy'] }
        : { orderBy?: ArtistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArtistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArtistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Artist model
   */
  readonly fields: ArtistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Artist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArtistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    leads<T extends Artist$leadsArgs<ExtArgs> = {}>(args?: Subset<T, Artist$leadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    releases<T extends Artist$releasesArgs<ExtArgs> = {}>(args?: Subset<T, Artist$releasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    instagramPosts<T extends Artist$instagramPostsArgs<ExtArgs> = {}>(args?: Subset<T, Artist$instagramPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends Artist$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Artist$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    contactInfos<T extends Artist$contactInfosArgs<ExtArgs> = {}>(args?: Subset<T, Artist$contactInfosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    primaryMerges<T extends Artist$primaryMergesArgs<ExtArgs> = {}>(args?: Subset<T, Artist$primaryMergesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    duplicateMerges<T extends Artist$duplicateMergesArgs<ExtArgs> = {}>(args?: Subset<T, Artist$duplicateMergesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Artist model
   */
  interface ArtistFieldRefs {
    readonly id: FieldRef<"Artist", 'String'>
    readonly name: FieldRef<"Artist", 'String'>
    readonly instagramHandle: FieldRef<"Artist", 'String'>
    readonly instagramProfileUrl: FieldRef<"Artist", 'String'>
    readonly instagramProfileImageUrl: FieldRef<"Artist", 'String'>
    readonly spotifyArtistId: FieldRef<"Artist", 'String'>
    readonly spotifyArtistUrl: FieldRef<"Artist", 'String'>
    readonly spotifyImageUrl: FieldRef<"Artist", 'String'>
    readonly spotifyAccent: FieldRef<"Artist", 'String'>
    readonly spotifyAccentStrong: FieldRef<"Artist", 'String'>
    readonly spotifyHighlight: FieldRef<"Artist", 'String'>
    readonly officialSiteUrl: FieldRef<"Artist", 'String'>
    readonly location: FieldRef<"Artist", 'String'>
    readonly city: FieldRef<"Artist", 'String'>
    readonly state: FieldRef<"Artist", 'String'>
    readonly country: FieldRef<"Artist", 'String'>
    readonly genre: FieldRef<"Artist", 'String'>
    readonly tags: FieldRef<"Artist", 'String[]'>
    readonly bio: FieldRef<"Artist", 'String'>
    readonly emails: FieldRef<"Artist", 'String[]'>
    readonly followerCount: FieldRef<"Artist", 'Int'>
    readonly lastPostAt: FieldRef<"Artist", 'DateTime'>
    readonly createdAt: FieldRef<"Artist", 'DateTime'>
    readonly updatedAt: FieldRef<"Artist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Artist findUnique
   */
  export type ArtistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter, which Artist to fetch.
     */
    where: ArtistWhereUniqueInput
  }

  /**
   * Artist findUniqueOrThrow
   */
  export type ArtistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter, which Artist to fetch.
     */
    where: ArtistWhereUniqueInput
  }

  /**
   * Artist findFirst
   */
  export type ArtistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter, which Artist to fetch.
     */
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistOrderByWithRelationInput | ArtistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Artists.
     */
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Artists.
     */
    distinct?: ArtistScalarFieldEnum | ArtistScalarFieldEnum[]
  }

  /**
   * Artist findFirstOrThrow
   */
  export type ArtistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter, which Artist to fetch.
     */
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistOrderByWithRelationInput | ArtistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Artists.
     */
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Artists.
     */
    distinct?: ArtistScalarFieldEnum | ArtistScalarFieldEnum[]
  }

  /**
   * Artist findMany
   */
  export type ArtistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where?: ArtistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistOrderByWithRelationInput | ArtistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Artists.
     */
    cursor?: ArtistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    distinct?: ArtistScalarFieldEnum | ArtistScalarFieldEnum[]
  }

  /**
   * Artist create
   */
  export type ArtistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * The data needed to create a Artist.
     */
    data: XOR<ArtistCreateInput, ArtistUncheckedCreateInput>
  }

  /**
   * Artist createMany
   */
  export type ArtistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Artists.
     */
    data: ArtistCreateManyInput | ArtistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Artist createManyAndReturn
   */
  export type ArtistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * The data used to create many Artists.
     */
    data: ArtistCreateManyInput | ArtistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Artist update
   */
  export type ArtistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * The data needed to update a Artist.
     */
    data: XOR<ArtistUpdateInput, ArtistUncheckedUpdateInput>
    /**
     * Choose, which Artist to update.
     */
    where: ArtistWhereUniqueInput
  }

  /**
   * Artist updateMany
   */
  export type ArtistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Artists.
     */
    data: XOR<ArtistUpdateManyMutationInput, ArtistUncheckedUpdateManyInput>
    /**
     * Filter which Artists to update
     */
    where?: ArtistWhereInput
    /**
     * Limit how many Artists to update.
     */
    limit?: number
  }

  /**
   * Artist updateManyAndReturn
   */
  export type ArtistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * The data used to update Artists.
     */
    data: XOR<ArtistUpdateManyMutationInput, ArtistUncheckedUpdateManyInput>
    /**
     * Filter which Artists to update
     */
    where?: ArtistWhereInput
    /**
     * Limit how many Artists to update.
     */
    limit?: number
  }

  /**
   * Artist upsert
   */
  export type ArtistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * The filter to search for the Artist to update in case it exists.
     */
    where: ArtistWhereUniqueInput
    /**
     * In case the Artist found by the `where` argument doesn't exist, create a new Artist with this data.
     */
    create: XOR<ArtistCreateInput, ArtistUncheckedCreateInput>
    /**
     * In case the Artist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArtistUpdateInput, ArtistUncheckedUpdateInput>
  }

  /**
   * Artist delete
   */
  export type ArtistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
    /**
     * Filter which Artist to delete.
     */
    where: ArtistWhereUniqueInput
  }

  /**
   * Artist deleteMany
   */
  export type ArtistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Artists to delete
     */
    where?: ArtistWhereInput
    /**
     * Limit how many Artists to delete.
     */
    limit?: number
  }

  /**
   * Artist.leads
   */
  export type Artist$leadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    cursor?: LeadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Artist.releases
   */
  export type Artist$releasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    where?: ReleaseWhereInput
    orderBy?: ReleaseOrderByWithRelationInput | ReleaseOrderByWithRelationInput[]
    cursor?: ReleaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReleaseScalarFieldEnum | ReleaseScalarFieldEnum[]
  }

  /**
   * Artist.instagramPosts
   */
  export type Artist$instagramPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    where?: InstagramPostWhereInput
    orderBy?: InstagramPostOrderByWithRelationInput | InstagramPostOrderByWithRelationInput[]
    cursor?: InstagramPostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InstagramPostScalarFieldEnum | InstagramPostScalarFieldEnum[]
  }

  /**
   * Artist.projects
   */
  export type Artist$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Artist.contactInfos
   */
  export type Artist$contactInfosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    where?: ContactInfoWhereInput
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    cursor?: ContactInfoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * Artist.primaryMerges
   */
  export type Artist$primaryMergesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    where?: MergeProposalWhereInput
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    cursor?: MergeProposalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MergeProposalScalarFieldEnum | MergeProposalScalarFieldEnum[]
  }

  /**
   * Artist.duplicateMerges
   */
  export type Artist$duplicateMergesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    where?: MergeProposalWhereInput
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    cursor?: MergeProposalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MergeProposalScalarFieldEnum | MergeProposalScalarFieldEnum[]
  }

  /**
   * Artist without action
   */
  export type ArtistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artist
     */
    select?: ArtistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artist
     */
    omit?: ArtistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistInclude<ExtArgs> | null
  }


  /**
   * Model Lead
   */

  export type AggregateLead = {
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  export type LeadAvgAggregateOutputType = {
    score: number | null
  }

  export type LeadSumAggregateOutputType = {
    score: number | null
  }

  export type LeadMinAggregateOutputType = {
    id: string | null
    artistId: string | null
    status: $Enums.LeadStatus | null
    score: number | null
    scoreRationale: string | null
    lastContactedAt: Date | null
    nextActionAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadMaxAggregateOutputType = {
    id: string | null
    artistId: string | null
    status: $Enums.LeadStatus | null
    score: number | null
    scoreRationale: string | null
    lastContactedAt: Date | null
    nextActionAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadCountAggregateOutputType = {
    id: number
    artistId: number
    status: number
    score: number
    scoreRationale: number
    lastContactedAt: number
    nextActionAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeadAvgAggregateInputType = {
    score?: true
  }

  export type LeadSumAggregateInputType = {
    score?: true
  }

  export type LeadMinAggregateInputType = {
    id?: true
    artistId?: true
    status?: true
    score?: true
    scoreRationale?: true
    lastContactedAt?: true
    nextActionAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadMaxAggregateInputType = {
    id?: true
    artistId?: true
    status?: true
    score?: true
    scoreRationale?: true
    lastContactedAt?: true
    nextActionAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadCountAggregateInputType = {
    id?: true
    artistId?: true
    status?: true
    score?: true
    scoreRationale?: true
    lastContactedAt?: true
    nextActionAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lead to aggregate.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leads
    **/
    _count?: true | LeadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadMaxAggregateInputType
  }

  export type GetLeadAggregateType<T extends LeadAggregateArgs> = {
        [P in keyof T & keyof AggregateLead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLead[P]>
      : GetScalarType<T[P], AggregateLead[P]>
  }




  export type LeadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithAggregationInput | LeadOrderByWithAggregationInput[]
    by: LeadScalarFieldEnum[] | LeadScalarFieldEnum
    having?: LeadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadCountAggregateInputType | true
    _avg?: LeadAvgAggregateInputType
    _sum?: LeadSumAggregateInputType
    _min?: LeadMinAggregateInputType
    _max?: LeadMaxAggregateInputType
  }

  export type LeadGroupByOutputType = {
    id: string
    artistId: string
    status: $Enums.LeadStatus
    score: number | null
    scoreRationale: string | null
    lastContactedAt: Date | null
    nextActionAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  type GetLeadGroupByPayload<T extends LeadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadGroupByOutputType[P]>
            : GetScalarType<T[P], LeadGroupByOutputType[P]>
        }
      >
    >


  export type LeadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    status?: boolean
    score?: boolean
    scoreRationale?: boolean
    lastContactedAt?: boolean
    nextActionAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
    messages?: boolean | Lead$messagesArgs<ExtArgs>
    activities?: boolean | Lead$activitiesArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    status?: boolean
    score?: boolean
    scoreRationale?: boolean
    lastContactedAt?: boolean
    nextActionAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    status?: boolean
    score?: boolean
    scoreRationale?: boolean
    lastContactedAt?: boolean
    nextActionAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectScalar = {
    id?: boolean
    artistId?: boolean
    status?: boolean
    score?: boolean
    scoreRationale?: boolean
    lastContactedAt?: boolean
    nextActionAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "artistId" | "status" | "score" | "scoreRationale" | "lastContactedAt" | "nextActionAt" | "createdAt" | "updatedAt", ExtArgs["result"]["lead"]>
  export type LeadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
    messages?: boolean | Lead$messagesArgs<ExtArgs>
    activities?: boolean | Lead$activitiesArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type LeadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $LeadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lead"
    objects: {
      artist: Prisma.$ArtistPayload<ExtArgs>
      messages: Prisma.$MessageDraftPayload<ExtArgs>[]
      activities: Prisma.$ActivityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      artistId: string
      status: $Enums.LeadStatus
      score: number | null
      scoreRationale: string | null
      lastContactedAt: Date | null
      nextActionAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lead"]>
    composites: {}
  }

  type LeadGetPayload<S extends boolean | null | undefined | LeadDefaultArgs> = $Result.GetResult<Prisma.$LeadPayload, S>

  type LeadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadCountAggregateInputType | true
    }

  export interface LeadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lead'], meta: { name: 'Lead' } }
    /**
     * Find zero or one Lead that matches the filter.
     * @param {LeadFindUniqueArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadFindUniqueArgs>(args: SelectSubset<T, LeadFindUniqueArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lead that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadFindUniqueOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadFindFirstArgs>(args?: SelectSubset<T, LeadFindFirstArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leads
     * const leads = await prisma.lead.findMany()
     * 
     * // Get first 10 Leads
     * const leads = await prisma.lead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadWithIdOnly = await prisma.lead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadFindManyArgs>(args?: SelectSubset<T, LeadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lead.
     * @param {LeadCreateArgs} args - Arguments to create a Lead.
     * @example
     * // Create one Lead
     * const Lead = await prisma.lead.create({
     *   data: {
     *     // ... data to create a Lead
     *   }
     * })
     * 
     */
    create<T extends LeadCreateArgs>(args: SelectSubset<T, LeadCreateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leads.
     * @param {LeadCreateManyArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadCreateManyArgs>(args?: SelectSubset<T, LeadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leads and returns the data saved in the database.
     * @param {LeadCreateManyAndReturnArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lead.
     * @param {LeadDeleteArgs} args - Arguments to delete one Lead.
     * @example
     * // Delete one Lead
     * const Lead = await prisma.lead.delete({
     *   where: {
     *     // ... filter to delete one Lead
     *   }
     * })
     * 
     */
    delete<T extends LeadDeleteArgs>(args: SelectSubset<T, LeadDeleteArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lead.
     * @param {LeadUpdateArgs} args - Arguments to update one Lead.
     * @example
     * // Update one Lead
     * const lead = await prisma.lead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadUpdateArgs>(args: SelectSubset<T, LeadUpdateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leads.
     * @param {LeadDeleteManyArgs} args - Arguments to filter Leads to delete.
     * @example
     * // Delete a few Leads
     * const { count } = await prisma.lead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadDeleteManyArgs>(args?: SelectSubset<T, LeadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadUpdateManyArgs>(args: SelectSubset<T, LeadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads and returns the data updated in the database.
     * @param {LeadUpdateManyAndReturnArgs} args - Arguments to update many Leads.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lead.
     * @param {LeadUpsertArgs} args - Arguments to update or create a Lead.
     * @example
     * // Update or create a Lead
     * const lead = await prisma.lead.upsert({
     *   create: {
     *     // ... data to create a Lead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lead we want to update
     *   }
     * })
     */
    upsert<T extends LeadUpsertArgs>(args: SelectSubset<T, LeadUpsertArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadCountArgs} args - Arguments to filter Leads to count.
     * @example
     * // Count the number of Leads
     * const count = await prisma.lead.count({
     *   where: {
     *     // ... the filter for the Leads we want to count
     *   }
     * })
    **/
    count<T extends LeadCountArgs>(
      args?: Subset<T, LeadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadAggregateArgs>(args: Subset<T, LeadAggregateArgs>): Prisma.PrismaPromise<GetLeadAggregateType<T>>

    /**
     * Group by Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadGroupByArgs['orderBy'] }
        : { orderBy?: LeadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lead model
   */
  readonly fields: LeadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    artist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends Lead$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Lead$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activities<T extends Lead$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, Lead$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lead model
   */
  interface LeadFieldRefs {
    readonly id: FieldRef<"Lead", 'String'>
    readonly artistId: FieldRef<"Lead", 'String'>
    readonly status: FieldRef<"Lead", 'LeadStatus'>
    readonly score: FieldRef<"Lead", 'Float'>
    readonly scoreRationale: FieldRef<"Lead", 'String'>
    readonly lastContactedAt: FieldRef<"Lead", 'DateTime'>
    readonly nextActionAt: FieldRef<"Lead", 'DateTime'>
    readonly createdAt: FieldRef<"Lead", 'DateTime'>
    readonly updatedAt: FieldRef<"Lead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lead findUnique
   */
  export type LeadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findUniqueOrThrow
   */
  export type LeadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findFirst
   */
  export type LeadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findFirstOrThrow
   */
  export type LeadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findMany
   */
  export type LeadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Leads to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead create
   */
  export type LeadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to create a Lead.
     */
    data: XOR<LeadCreateInput, LeadUncheckedCreateInput>
  }

  /**
   * Lead createMany
   */
  export type LeadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead createManyAndReturn
   */
  export type LeadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lead update
   */
  export type LeadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to update a Lead.
     */
    data: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
    /**
     * Choose, which Lead to update.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead updateMany
   */
  export type LeadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead updateManyAndReturn
   */
  export type LeadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lead upsert
   */
  export type LeadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The filter to search for the Lead to update in case it exists.
     */
    where: LeadWhereUniqueInput
    /**
     * In case the Lead found by the `where` argument doesn't exist, create a new Lead with this data.
     */
    create: XOR<LeadCreateInput, LeadUncheckedCreateInput>
    /**
     * In case the Lead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
  }

  /**
   * Lead delete
   */
  export type LeadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter which Lead to delete.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead deleteMany
   */
  export type LeadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leads to delete
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to delete.
     */
    limit?: number
  }

  /**
   * Lead.messages
   */
  export type Lead$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    where?: MessageDraftWhereInput
    orderBy?: MessageDraftOrderByWithRelationInput | MessageDraftOrderByWithRelationInput[]
    cursor?: MessageDraftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageDraftScalarFieldEnum | MessageDraftScalarFieldEnum[]
  }

  /**
   * Lead.activities
   */
  export type Lead$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    where?: ActivityWhereInput
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    cursor?: ActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Lead without action
   */
  export type LeadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
  }


  /**
   * Model Release
   */

  export type AggregateRelease = {
    _count: ReleaseCountAggregateOutputType | null
    _min: ReleaseMinAggregateOutputType | null
    _max: ReleaseMaxAggregateOutputType | null
  }

  export type ReleaseMinAggregateOutputType = {
    id: string | null
    artistId: string | null
    spotifyTrackId: string | null
    spotifyReleaseId: string | null
    title: string | null
    releaseDate: Date | null
    imageUrl: string | null
    url: string | null
    releaseType: string | null
    createdAt: Date | null
  }

  export type ReleaseMaxAggregateOutputType = {
    id: string | null
    artistId: string | null
    spotifyTrackId: string | null
    spotifyReleaseId: string | null
    title: string | null
    releaseDate: Date | null
    imageUrl: string | null
    url: string | null
    releaseType: string | null
    createdAt: Date | null
  }

  export type ReleaseCountAggregateOutputType = {
    id: number
    artistId: number
    spotifyTrackId: number
    spotifyReleaseId: number
    title: number
    releaseDate: number
    imageUrl: number
    url: number
    releaseType: number
    createdAt: number
    _all: number
  }


  export type ReleaseMinAggregateInputType = {
    id?: true
    artistId?: true
    spotifyTrackId?: true
    spotifyReleaseId?: true
    title?: true
    releaseDate?: true
    imageUrl?: true
    url?: true
    releaseType?: true
    createdAt?: true
  }

  export type ReleaseMaxAggregateInputType = {
    id?: true
    artistId?: true
    spotifyTrackId?: true
    spotifyReleaseId?: true
    title?: true
    releaseDate?: true
    imageUrl?: true
    url?: true
    releaseType?: true
    createdAt?: true
  }

  export type ReleaseCountAggregateInputType = {
    id?: true
    artistId?: true
    spotifyTrackId?: true
    spotifyReleaseId?: true
    title?: true
    releaseDate?: true
    imageUrl?: true
    url?: true
    releaseType?: true
    createdAt?: true
    _all?: true
  }

  export type ReleaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Release to aggregate.
     */
    where?: ReleaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Releases to fetch.
     */
    orderBy?: ReleaseOrderByWithRelationInput | ReleaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReleaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Releases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Releases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Releases
    **/
    _count?: true | ReleaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReleaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReleaseMaxAggregateInputType
  }

  export type GetReleaseAggregateType<T extends ReleaseAggregateArgs> = {
        [P in keyof T & keyof AggregateRelease]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelease[P]>
      : GetScalarType<T[P], AggregateRelease[P]>
  }




  export type ReleaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReleaseWhereInput
    orderBy?: ReleaseOrderByWithAggregationInput | ReleaseOrderByWithAggregationInput[]
    by: ReleaseScalarFieldEnum[] | ReleaseScalarFieldEnum
    having?: ReleaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReleaseCountAggregateInputType | true
    _min?: ReleaseMinAggregateInputType
    _max?: ReleaseMaxAggregateInputType
  }

  export type ReleaseGroupByOutputType = {
    id: string
    artistId: string
    spotifyTrackId: string | null
    spotifyReleaseId: string | null
    title: string
    releaseDate: Date | null
    imageUrl: string | null
    url: string | null
    releaseType: string | null
    createdAt: Date
    _count: ReleaseCountAggregateOutputType | null
    _min: ReleaseMinAggregateOutputType | null
    _max: ReleaseMaxAggregateOutputType | null
  }

  type GetReleaseGroupByPayload<T extends ReleaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReleaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReleaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReleaseGroupByOutputType[P]>
            : GetScalarType<T[P], ReleaseGroupByOutputType[P]>
        }
      >
    >


  export type ReleaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    spotifyTrackId?: boolean
    spotifyReleaseId?: boolean
    title?: boolean
    releaseDate?: boolean
    imageUrl?: boolean
    url?: boolean
    releaseType?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["release"]>

  export type ReleaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    spotifyTrackId?: boolean
    spotifyReleaseId?: boolean
    title?: boolean
    releaseDate?: boolean
    imageUrl?: boolean
    url?: boolean
    releaseType?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["release"]>

  export type ReleaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    spotifyTrackId?: boolean
    spotifyReleaseId?: boolean
    title?: boolean
    releaseDate?: boolean
    imageUrl?: boolean
    url?: boolean
    releaseType?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["release"]>

  export type ReleaseSelectScalar = {
    id?: boolean
    artistId?: boolean
    spotifyTrackId?: boolean
    spotifyReleaseId?: boolean
    title?: boolean
    releaseDate?: boolean
    imageUrl?: boolean
    url?: boolean
    releaseType?: boolean
    createdAt?: boolean
  }

  export type ReleaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "artistId" | "spotifyTrackId" | "spotifyReleaseId" | "title" | "releaseDate" | "imageUrl" | "url" | "releaseType" | "createdAt", ExtArgs["result"]["release"]>
  export type ReleaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type ReleaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type ReleaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $ReleasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Release"
    objects: {
      artist: Prisma.$ArtistPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      artistId: string
      spotifyTrackId: string | null
      spotifyReleaseId: string | null
      title: string
      releaseDate: Date | null
      imageUrl: string | null
      url: string | null
      releaseType: string | null
      createdAt: Date
    }, ExtArgs["result"]["release"]>
    composites: {}
  }

  type ReleaseGetPayload<S extends boolean | null | undefined | ReleaseDefaultArgs> = $Result.GetResult<Prisma.$ReleasePayload, S>

  type ReleaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReleaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReleaseCountAggregateInputType | true
    }

  export interface ReleaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Release'], meta: { name: 'Release' } }
    /**
     * Find zero or one Release that matches the filter.
     * @param {ReleaseFindUniqueArgs} args - Arguments to find a Release
     * @example
     * // Get one Release
     * const release = await prisma.release.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReleaseFindUniqueArgs>(args: SelectSubset<T, ReleaseFindUniqueArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Release that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReleaseFindUniqueOrThrowArgs} args - Arguments to find a Release
     * @example
     * // Get one Release
     * const release = await prisma.release.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReleaseFindUniqueOrThrowArgs>(args: SelectSubset<T, ReleaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Release that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseFindFirstArgs} args - Arguments to find a Release
     * @example
     * // Get one Release
     * const release = await prisma.release.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReleaseFindFirstArgs>(args?: SelectSubset<T, ReleaseFindFirstArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Release that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseFindFirstOrThrowArgs} args - Arguments to find a Release
     * @example
     * // Get one Release
     * const release = await prisma.release.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReleaseFindFirstOrThrowArgs>(args?: SelectSubset<T, ReleaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Releases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Releases
     * const releases = await prisma.release.findMany()
     * 
     * // Get first 10 Releases
     * const releases = await prisma.release.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const releaseWithIdOnly = await prisma.release.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReleaseFindManyArgs>(args?: SelectSubset<T, ReleaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Release.
     * @param {ReleaseCreateArgs} args - Arguments to create a Release.
     * @example
     * // Create one Release
     * const Release = await prisma.release.create({
     *   data: {
     *     // ... data to create a Release
     *   }
     * })
     * 
     */
    create<T extends ReleaseCreateArgs>(args: SelectSubset<T, ReleaseCreateArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Releases.
     * @param {ReleaseCreateManyArgs} args - Arguments to create many Releases.
     * @example
     * // Create many Releases
     * const release = await prisma.release.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReleaseCreateManyArgs>(args?: SelectSubset<T, ReleaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Releases and returns the data saved in the database.
     * @param {ReleaseCreateManyAndReturnArgs} args - Arguments to create many Releases.
     * @example
     * // Create many Releases
     * const release = await prisma.release.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Releases and only return the `id`
     * const releaseWithIdOnly = await prisma.release.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReleaseCreateManyAndReturnArgs>(args?: SelectSubset<T, ReleaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Release.
     * @param {ReleaseDeleteArgs} args - Arguments to delete one Release.
     * @example
     * // Delete one Release
     * const Release = await prisma.release.delete({
     *   where: {
     *     // ... filter to delete one Release
     *   }
     * })
     * 
     */
    delete<T extends ReleaseDeleteArgs>(args: SelectSubset<T, ReleaseDeleteArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Release.
     * @param {ReleaseUpdateArgs} args - Arguments to update one Release.
     * @example
     * // Update one Release
     * const release = await prisma.release.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReleaseUpdateArgs>(args: SelectSubset<T, ReleaseUpdateArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Releases.
     * @param {ReleaseDeleteManyArgs} args - Arguments to filter Releases to delete.
     * @example
     * // Delete a few Releases
     * const { count } = await prisma.release.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReleaseDeleteManyArgs>(args?: SelectSubset<T, ReleaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Releases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Releases
     * const release = await prisma.release.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReleaseUpdateManyArgs>(args: SelectSubset<T, ReleaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Releases and returns the data updated in the database.
     * @param {ReleaseUpdateManyAndReturnArgs} args - Arguments to update many Releases.
     * @example
     * // Update many Releases
     * const release = await prisma.release.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Releases and only return the `id`
     * const releaseWithIdOnly = await prisma.release.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReleaseUpdateManyAndReturnArgs>(args: SelectSubset<T, ReleaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Release.
     * @param {ReleaseUpsertArgs} args - Arguments to update or create a Release.
     * @example
     * // Update or create a Release
     * const release = await prisma.release.upsert({
     *   create: {
     *     // ... data to create a Release
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Release we want to update
     *   }
     * })
     */
    upsert<T extends ReleaseUpsertArgs>(args: SelectSubset<T, ReleaseUpsertArgs<ExtArgs>>): Prisma__ReleaseClient<$Result.GetResult<Prisma.$ReleasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Releases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseCountArgs} args - Arguments to filter Releases to count.
     * @example
     * // Count the number of Releases
     * const count = await prisma.release.count({
     *   where: {
     *     // ... the filter for the Releases we want to count
     *   }
     * })
    **/
    count<T extends ReleaseCountArgs>(
      args?: Subset<T, ReleaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReleaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Release.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReleaseAggregateArgs>(args: Subset<T, ReleaseAggregateArgs>): Prisma.PrismaPromise<GetReleaseAggregateType<T>>

    /**
     * Group by Release.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReleaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReleaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReleaseGroupByArgs['orderBy'] }
        : { orderBy?: ReleaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReleaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReleaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Release model
   */
  readonly fields: ReleaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Release.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReleaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    artist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Release model
   */
  interface ReleaseFieldRefs {
    readonly id: FieldRef<"Release", 'String'>
    readonly artistId: FieldRef<"Release", 'String'>
    readonly spotifyTrackId: FieldRef<"Release", 'String'>
    readonly spotifyReleaseId: FieldRef<"Release", 'String'>
    readonly title: FieldRef<"Release", 'String'>
    readonly releaseDate: FieldRef<"Release", 'DateTime'>
    readonly imageUrl: FieldRef<"Release", 'String'>
    readonly url: FieldRef<"Release", 'String'>
    readonly releaseType: FieldRef<"Release", 'String'>
    readonly createdAt: FieldRef<"Release", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Release findUnique
   */
  export type ReleaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter, which Release to fetch.
     */
    where: ReleaseWhereUniqueInput
  }

  /**
   * Release findUniqueOrThrow
   */
  export type ReleaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter, which Release to fetch.
     */
    where: ReleaseWhereUniqueInput
  }

  /**
   * Release findFirst
   */
  export type ReleaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter, which Release to fetch.
     */
    where?: ReleaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Releases to fetch.
     */
    orderBy?: ReleaseOrderByWithRelationInput | ReleaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Releases.
     */
    cursor?: ReleaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Releases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Releases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Releases.
     */
    distinct?: ReleaseScalarFieldEnum | ReleaseScalarFieldEnum[]
  }

  /**
   * Release findFirstOrThrow
   */
  export type ReleaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter, which Release to fetch.
     */
    where?: ReleaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Releases to fetch.
     */
    orderBy?: ReleaseOrderByWithRelationInput | ReleaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Releases.
     */
    cursor?: ReleaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Releases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Releases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Releases.
     */
    distinct?: ReleaseScalarFieldEnum | ReleaseScalarFieldEnum[]
  }

  /**
   * Release findMany
   */
  export type ReleaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter, which Releases to fetch.
     */
    where?: ReleaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Releases to fetch.
     */
    orderBy?: ReleaseOrderByWithRelationInput | ReleaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Releases.
     */
    cursor?: ReleaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Releases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Releases.
     */
    skip?: number
    distinct?: ReleaseScalarFieldEnum | ReleaseScalarFieldEnum[]
  }

  /**
   * Release create
   */
  export type ReleaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Release.
     */
    data: XOR<ReleaseCreateInput, ReleaseUncheckedCreateInput>
  }

  /**
   * Release createMany
   */
  export type ReleaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Releases.
     */
    data: ReleaseCreateManyInput | ReleaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Release createManyAndReturn
   */
  export type ReleaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * The data used to create many Releases.
     */
    data: ReleaseCreateManyInput | ReleaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Release update
   */
  export type ReleaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Release.
     */
    data: XOR<ReleaseUpdateInput, ReleaseUncheckedUpdateInput>
    /**
     * Choose, which Release to update.
     */
    where: ReleaseWhereUniqueInput
  }

  /**
   * Release updateMany
   */
  export type ReleaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Releases.
     */
    data: XOR<ReleaseUpdateManyMutationInput, ReleaseUncheckedUpdateManyInput>
    /**
     * Filter which Releases to update
     */
    where?: ReleaseWhereInput
    /**
     * Limit how many Releases to update.
     */
    limit?: number
  }

  /**
   * Release updateManyAndReturn
   */
  export type ReleaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * The data used to update Releases.
     */
    data: XOR<ReleaseUpdateManyMutationInput, ReleaseUncheckedUpdateManyInput>
    /**
     * Filter which Releases to update
     */
    where?: ReleaseWhereInput
    /**
     * Limit how many Releases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Release upsert
   */
  export type ReleaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Release to update in case it exists.
     */
    where: ReleaseWhereUniqueInput
    /**
     * In case the Release found by the `where` argument doesn't exist, create a new Release with this data.
     */
    create: XOR<ReleaseCreateInput, ReleaseUncheckedCreateInput>
    /**
     * In case the Release was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReleaseUpdateInput, ReleaseUncheckedUpdateInput>
  }

  /**
   * Release delete
   */
  export type ReleaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
    /**
     * Filter which Release to delete.
     */
    where: ReleaseWhereUniqueInput
  }

  /**
   * Release deleteMany
   */
  export type ReleaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Releases to delete
     */
    where?: ReleaseWhereInput
    /**
     * Limit how many Releases to delete.
     */
    limit?: number
  }

  /**
   * Release without action
   */
  export type ReleaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Release
     */
    select?: ReleaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Release
     */
    omit?: ReleaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReleaseInclude<ExtArgs> | null
  }


  /**
   * Model InstagramPost
   */

  export type AggregateInstagramPost = {
    _count: InstagramPostCountAggregateOutputType | null
    _min: InstagramPostMinAggregateOutputType | null
    _max: InstagramPostMaxAggregateOutputType | null
  }

  export type InstagramPostMinAggregateOutputType = {
    id: string | null
    artistId: string | null
    instagramPostId: string | null
    caption: string | null
    imageUrl: string | null
    postedAt: Date | null
    url: string | null
    createdAt: Date | null
  }

  export type InstagramPostMaxAggregateOutputType = {
    id: string | null
    artistId: string | null
    instagramPostId: string | null
    caption: string | null
    imageUrl: string | null
    postedAt: Date | null
    url: string | null
    createdAt: Date | null
  }

  export type InstagramPostCountAggregateOutputType = {
    id: number
    artistId: number
    instagramPostId: number
    caption: number
    imageUrl: number
    postedAt: number
    url: number
    createdAt: number
    _all: number
  }


  export type InstagramPostMinAggregateInputType = {
    id?: true
    artistId?: true
    instagramPostId?: true
    caption?: true
    imageUrl?: true
    postedAt?: true
    url?: true
    createdAt?: true
  }

  export type InstagramPostMaxAggregateInputType = {
    id?: true
    artistId?: true
    instagramPostId?: true
    caption?: true
    imageUrl?: true
    postedAt?: true
    url?: true
    createdAt?: true
  }

  export type InstagramPostCountAggregateInputType = {
    id?: true
    artistId?: true
    instagramPostId?: true
    caption?: true
    imageUrl?: true
    postedAt?: true
    url?: true
    createdAt?: true
    _all?: true
  }

  export type InstagramPostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstagramPost to aggregate.
     */
    where?: InstagramPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstagramPosts to fetch.
     */
    orderBy?: InstagramPostOrderByWithRelationInput | InstagramPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstagramPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstagramPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstagramPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InstagramPosts
    **/
    _count?: true | InstagramPostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstagramPostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstagramPostMaxAggregateInputType
  }

  export type GetInstagramPostAggregateType<T extends InstagramPostAggregateArgs> = {
        [P in keyof T & keyof AggregateInstagramPost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstagramPost[P]>
      : GetScalarType<T[P], AggregateInstagramPost[P]>
  }




  export type InstagramPostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstagramPostWhereInput
    orderBy?: InstagramPostOrderByWithAggregationInput | InstagramPostOrderByWithAggregationInput[]
    by: InstagramPostScalarFieldEnum[] | InstagramPostScalarFieldEnum
    having?: InstagramPostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstagramPostCountAggregateInputType | true
    _min?: InstagramPostMinAggregateInputType
    _max?: InstagramPostMaxAggregateInputType
  }

  export type InstagramPostGroupByOutputType = {
    id: string
    artistId: string
    instagramPostId: string | null
    caption: string | null
    imageUrl: string | null
    postedAt: Date | null
    url: string | null
    createdAt: Date
    _count: InstagramPostCountAggregateOutputType | null
    _min: InstagramPostMinAggregateOutputType | null
    _max: InstagramPostMaxAggregateOutputType | null
  }

  type GetInstagramPostGroupByPayload<T extends InstagramPostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstagramPostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstagramPostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstagramPostGroupByOutputType[P]>
            : GetScalarType<T[P], InstagramPostGroupByOutputType[P]>
        }
      >
    >


  export type InstagramPostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    instagramPostId?: boolean
    caption?: boolean
    imageUrl?: boolean
    postedAt?: boolean
    url?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["instagramPost"]>

  export type InstagramPostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    instagramPostId?: boolean
    caption?: boolean
    imageUrl?: boolean
    postedAt?: boolean
    url?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["instagramPost"]>

  export type InstagramPostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    instagramPostId?: boolean
    caption?: boolean
    imageUrl?: boolean
    postedAt?: boolean
    url?: boolean
    createdAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["instagramPost"]>

  export type InstagramPostSelectScalar = {
    id?: boolean
    artistId?: boolean
    instagramPostId?: boolean
    caption?: boolean
    imageUrl?: boolean
    postedAt?: boolean
    url?: boolean
    createdAt?: boolean
  }

  export type InstagramPostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "artistId" | "instagramPostId" | "caption" | "imageUrl" | "postedAt" | "url" | "createdAt", ExtArgs["result"]["instagramPost"]>
  export type InstagramPostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type InstagramPostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type InstagramPostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $InstagramPostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InstagramPost"
    objects: {
      artist: Prisma.$ArtistPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      artistId: string
      instagramPostId: string | null
      caption: string | null
      imageUrl: string | null
      postedAt: Date | null
      url: string | null
      createdAt: Date
    }, ExtArgs["result"]["instagramPost"]>
    composites: {}
  }

  type InstagramPostGetPayload<S extends boolean | null | undefined | InstagramPostDefaultArgs> = $Result.GetResult<Prisma.$InstagramPostPayload, S>

  type InstagramPostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstagramPostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstagramPostCountAggregateInputType | true
    }

  export interface InstagramPostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InstagramPost'], meta: { name: 'InstagramPost' } }
    /**
     * Find zero or one InstagramPost that matches the filter.
     * @param {InstagramPostFindUniqueArgs} args - Arguments to find a InstagramPost
     * @example
     * // Get one InstagramPost
     * const instagramPost = await prisma.instagramPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstagramPostFindUniqueArgs>(args: SelectSubset<T, InstagramPostFindUniqueArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InstagramPost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstagramPostFindUniqueOrThrowArgs} args - Arguments to find a InstagramPost
     * @example
     * // Get one InstagramPost
     * const instagramPost = await prisma.instagramPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstagramPostFindUniqueOrThrowArgs>(args: SelectSubset<T, InstagramPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstagramPost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostFindFirstArgs} args - Arguments to find a InstagramPost
     * @example
     * // Get one InstagramPost
     * const instagramPost = await prisma.instagramPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstagramPostFindFirstArgs>(args?: SelectSubset<T, InstagramPostFindFirstArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstagramPost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostFindFirstOrThrowArgs} args - Arguments to find a InstagramPost
     * @example
     * // Get one InstagramPost
     * const instagramPost = await prisma.instagramPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstagramPostFindFirstOrThrowArgs>(args?: SelectSubset<T, InstagramPostFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InstagramPosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InstagramPosts
     * const instagramPosts = await prisma.instagramPost.findMany()
     * 
     * // Get first 10 InstagramPosts
     * const instagramPosts = await prisma.instagramPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const instagramPostWithIdOnly = await prisma.instagramPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstagramPostFindManyArgs>(args?: SelectSubset<T, InstagramPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InstagramPost.
     * @param {InstagramPostCreateArgs} args - Arguments to create a InstagramPost.
     * @example
     * // Create one InstagramPost
     * const InstagramPost = await prisma.instagramPost.create({
     *   data: {
     *     // ... data to create a InstagramPost
     *   }
     * })
     * 
     */
    create<T extends InstagramPostCreateArgs>(args: SelectSubset<T, InstagramPostCreateArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InstagramPosts.
     * @param {InstagramPostCreateManyArgs} args - Arguments to create many InstagramPosts.
     * @example
     * // Create many InstagramPosts
     * const instagramPost = await prisma.instagramPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstagramPostCreateManyArgs>(args?: SelectSubset<T, InstagramPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InstagramPosts and returns the data saved in the database.
     * @param {InstagramPostCreateManyAndReturnArgs} args - Arguments to create many InstagramPosts.
     * @example
     * // Create many InstagramPosts
     * const instagramPost = await prisma.instagramPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InstagramPosts and only return the `id`
     * const instagramPostWithIdOnly = await prisma.instagramPost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstagramPostCreateManyAndReturnArgs>(args?: SelectSubset<T, InstagramPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InstagramPost.
     * @param {InstagramPostDeleteArgs} args - Arguments to delete one InstagramPost.
     * @example
     * // Delete one InstagramPost
     * const InstagramPost = await prisma.instagramPost.delete({
     *   where: {
     *     // ... filter to delete one InstagramPost
     *   }
     * })
     * 
     */
    delete<T extends InstagramPostDeleteArgs>(args: SelectSubset<T, InstagramPostDeleteArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InstagramPost.
     * @param {InstagramPostUpdateArgs} args - Arguments to update one InstagramPost.
     * @example
     * // Update one InstagramPost
     * const instagramPost = await prisma.instagramPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstagramPostUpdateArgs>(args: SelectSubset<T, InstagramPostUpdateArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InstagramPosts.
     * @param {InstagramPostDeleteManyArgs} args - Arguments to filter InstagramPosts to delete.
     * @example
     * // Delete a few InstagramPosts
     * const { count } = await prisma.instagramPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstagramPostDeleteManyArgs>(args?: SelectSubset<T, InstagramPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstagramPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InstagramPosts
     * const instagramPost = await prisma.instagramPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstagramPostUpdateManyArgs>(args: SelectSubset<T, InstagramPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstagramPosts and returns the data updated in the database.
     * @param {InstagramPostUpdateManyAndReturnArgs} args - Arguments to update many InstagramPosts.
     * @example
     * // Update many InstagramPosts
     * const instagramPost = await prisma.instagramPost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InstagramPosts and only return the `id`
     * const instagramPostWithIdOnly = await prisma.instagramPost.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InstagramPostUpdateManyAndReturnArgs>(args: SelectSubset<T, InstagramPostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InstagramPost.
     * @param {InstagramPostUpsertArgs} args - Arguments to update or create a InstagramPost.
     * @example
     * // Update or create a InstagramPost
     * const instagramPost = await prisma.instagramPost.upsert({
     *   create: {
     *     // ... data to create a InstagramPost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InstagramPost we want to update
     *   }
     * })
     */
    upsert<T extends InstagramPostUpsertArgs>(args: SelectSubset<T, InstagramPostUpsertArgs<ExtArgs>>): Prisma__InstagramPostClient<$Result.GetResult<Prisma.$InstagramPostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InstagramPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostCountArgs} args - Arguments to filter InstagramPosts to count.
     * @example
     * // Count the number of InstagramPosts
     * const count = await prisma.instagramPost.count({
     *   where: {
     *     // ... the filter for the InstagramPosts we want to count
     *   }
     * })
    **/
    count<T extends InstagramPostCountArgs>(
      args?: Subset<T, InstagramPostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstagramPostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InstagramPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InstagramPostAggregateArgs>(args: Subset<T, InstagramPostAggregateArgs>): Prisma.PrismaPromise<GetInstagramPostAggregateType<T>>

    /**
     * Group by InstagramPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstagramPostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InstagramPostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstagramPostGroupByArgs['orderBy'] }
        : { orderBy?: InstagramPostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InstagramPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstagramPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InstagramPost model
   */
  readonly fields: InstagramPostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InstagramPost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstagramPostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    artist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InstagramPost model
   */
  interface InstagramPostFieldRefs {
    readonly id: FieldRef<"InstagramPost", 'String'>
    readonly artistId: FieldRef<"InstagramPost", 'String'>
    readonly instagramPostId: FieldRef<"InstagramPost", 'String'>
    readonly caption: FieldRef<"InstagramPost", 'String'>
    readonly imageUrl: FieldRef<"InstagramPost", 'String'>
    readonly postedAt: FieldRef<"InstagramPost", 'DateTime'>
    readonly url: FieldRef<"InstagramPost", 'String'>
    readonly createdAt: FieldRef<"InstagramPost", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InstagramPost findUnique
   */
  export type InstagramPostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter, which InstagramPost to fetch.
     */
    where: InstagramPostWhereUniqueInput
  }

  /**
   * InstagramPost findUniqueOrThrow
   */
  export type InstagramPostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter, which InstagramPost to fetch.
     */
    where: InstagramPostWhereUniqueInput
  }

  /**
   * InstagramPost findFirst
   */
  export type InstagramPostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter, which InstagramPost to fetch.
     */
    where?: InstagramPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstagramPosts to fetch.
     */
    orderBy?: InstagramPostOrderByWithRelationInput | InstagramPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstagramPosts.
     */
    cursor?: InstagramPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstagramPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstagramPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstagramPosts.
     */
    distinct?: InstagramPostScalarFieldEnum | InstagramPostScalarFieldEnum[]
  }

  /**
   * InstagramPost findFirstOrThrow
   */
  export type InstagramPostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter, which InstagramPost to fetch.
     */
    where?: InstagramPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstagramPosts to fetch.
     */
    orderBy?: InstagramPostOrderByWithRelationInput | InstagramPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstagramPosts.
     */
    cursor?: InstagramPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstagramPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstagramPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstagramPosts.
     */
    distinct?: InstagramPostScalarFieldEnum | InstagramPostScalarFieldEnum[]
  }

  /**
   * InstagramPost findMany
   */
  export type InstagramPostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter, which InstagramPosts to fetch.
     */
    where?: InstagramPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstagramPosts to fetch.
     */
    orderBy?: InstagramPostOrderByWithRelationInput | InstagramPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InstagramPosts.
     */
    cursor?: InstagramPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstagramPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstagramPosts.
     */
    skip?: number
    distinct?: InstagramPostScalarFieldEnum | InstagramPostScalarFieldEnum[]
  }

  /**
   * InstagramPost create
   */
  export type InstagramPostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * The data needed to create a InstagramPost.
     */
    data: XOR<InstagramPostCreateInput, InstagramPostUncheckedCreateInput>
  }

  /**
   * InstagramPost createMany
   */
  export type InstagramPostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InstagramPosts.
     */
    data: InstagramPostCreateManyInput | InstagramPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InstagramPost createManyAndReturn
   */
  export type InstagramPostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * The data used to create many InstagramPosts.
     */
    data: InstagramPostCreateManyInput | InstagramPostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstagramPost update
   */
  export type InstagramPostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * The data needed to update a InstagramPost.
     */
    data: XOR<InstagramPostUpdateInput, InstagramPostUncheckedUpdateInput>
    /**
     * Choose, which InstagramPost to update.
     */
    where: InstagramPostWhereUniqueInput
  }

  /**
   * InstagramPost updateMany
   */
  export type InstagramPostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InstagramPosts.
     */
    data: XOR<InstagramPostUpdateManyMutationInput, InstagramPostUncheckedUpdateManyInput>
    /**
     * Filter which InstagramPosts to update
     */
    where?: InstagramPostWhereInput
    /**
     * Limit how many InstagramPosts to update.
     */
    limit?: number
  }

  /**
   * InstagramPost updateManyAndReturn
   */
  export type InstagramPostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * The data used to update InstagramPosts.
     */
    data: XOR<InstagramPostUpdateManyMutationInput, InstagramPostUncheckedUpdateManyInput>
    /**
     * Filter which InstagramPosts to update
     */
    where?: InstagramPostWhereInput
    /**
     * Limit how many InstagramPosts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstagramPost upsert
   */
  export type InstagramPostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * The filter to search for the InstagramPost to update in case it exists.
     */
    where: InstagramPostWhereUniqueInput
    /**
     * In case the InstagramPost found by the `where` argument doesn't exist, create a new InstagramPost with this data.
     */
    create: XOR<InstagramPostCreateInput, InstagramPostUncheckedCreateInput>
    /**
     * In case the InstagramPost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstagramPostUpdateInput, InstagramPostUncheckedUpdateInput>
  }

  /**
   * InstagramPost delete
   */
  export type InstagramPostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
    /**
     * Filter which InstagramPost to delete.
     */
    where: InstagramPostWhereUniqueInput
  }

  /**
   * InstagramPost deleteMany
   */
  export type InstagramPostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstagramPosts to delete
     */
    where?: InstagramPostWhereInput
    /**
     * Limit how many InstagramPosts to delete.
     */
    limit?: number
  }

  /**
   * InstagramPost without action
   */
  export type InstagramPostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstagramPost
     */
    select?: InstagramPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstagramPost
     */
    omit?: InstagramPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstagramPostInclude<ExtArgs> | null
  }


  /**
   * Model MessageDraft
   */

  export type AggregateMessageDraft = {
    _count: MessageDraftCountAggregateOutputType | null
    _min: MessageDraftMinAggregateOutputType | null
    _max: MessageDraftMaxAggregateOutputType | null
  }

  export type MessageDraftMinAggregateOutputType = {
    id: string | null
    leadId: string | null
    tone: string | null
    body: string | null
    source: string | null
    selected: boolean | null
    createdAt: Date | null
  }

  export type MessageDraftMaxAggregateOutputType = {
    id: string | null
    leadId: string | null
    tone: string | null
    body: string | null
    source: string | null
    selected: boolean | null
    createdAt: Date | null
  }

  export type MessageDraftCountAggregateOutputType = {
    id: number
    leadId: number
    tone: number
    body: number
    source: number
    selected: number
    createdAt: number
    _all: number
  }


  export type MessageDraftMinAggregateInputType = {
    id?: true
    leadId?: true
    tone?: true
    body?: true
    source?: true
    selected?: true
    createdAt?: true
  }

  export type MessageDraftMaxAggregateInputType = {
    id?: true
    leadId?: true
    tone?: true
    body?: true
    source?: true
    selected?: true
    createdAt?: true
  }

  export type MessageDraftCountAggregateInputType = {
    id?: true
    leadId?: true
    tone?: true
    body?: true
    source?: true
    selected?: true
    createdAt?: true
    _all?: true
  }

  export type MessageDraftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageDraft to aggregate.
     */
    where?: MessageDraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageDrafts to fetch.
     */
    orderBy?: MessageDraftOrderByWithRelationInput | MessageDraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageDraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageDrafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageDrafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MessageDrafts
    **/
    _count?: true | MessageDraftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageDraftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageDraftMaxAggregateInputType
  }

  export type GetMessageDraftAggregateType<T extends MessageDraftAggregateArgs> = {
        [P in keyof T & keyof AggregateMessageDraft]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessageDraft[P]>
      : GetScalarType<T[P], AggregateMessageDraft[P]>
  }




  export type MessageDraftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageDraftWhereInput
    orderBy?: MessageDraftOrderByWithAggregationInput | MessageDraftOrderByWithAggregationInput[]
    by: MessageDraftScalarFieldEnum[] | MessageDraftScalarFieldEnum
    having?: MessageDraftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageDraftCountAggregateInputType | true
    _min?: MessageDraftMinAggregateInputType
    _max?: MessageDraftMaxAggregateInputType
  }

  export type MessageDraftGroupByOutputType = {
    id: string
    leadId: string
    tone: string | null
    body: string
    source: string | null
    selected: boolean
    createdAt: Date
    _count: MessageDraftCountAggregateOutputType | null
    _min: MessageDraftMinAggregateOutputType | null
    _max: MessageDraftMaxAggregateOutputType | null
  }

  type GetMessageDraftGroupByPayload<T extends MessageDraftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageDraftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageDraftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageDraftGroupByOutputType[P]>
            : GetScalarType<T[P], MessageDraftGroupByOutputType[P]>
        }
      >
    >


  export type MessageDraftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    tone?: boolean
    body?: boolean
    source?: boolean
    selected?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageDraft"]>

  export type MessageDraftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    tone?: boolean
    body?: boolean
    source?: boolean
    selected?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageDraft"]>

  export type MessageDraftSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    tone?: boolean
    body?: boolean
    source?: boolean
    selected?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageDraft"]>

  export type MessageDraftSelectScalar = {
    id?: boolean
    leadId?: boolean
    tone?: boolean
    body?: boolean
    source?: boolean
    selected?: boolean
    createdAt?: boolean
  }

  export type MessageDraftOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "leadId" | "tone" | "body" | "source" | "selected" | "createdAt", ExtArgs["result"]["messageDraft"]>
  export type MessageDraftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type MessageDraftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type MessageDraftIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }

  export type $MessageDraftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MessageDraft"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      leadId: string
      tone: string | null
      body: string
      source: string | null
      selected: boolean
      createdAt: Date
    }, ExtArgs["result"]["messageDraft"]>
    composites: {}
  }

  type MessageDraftGetPayload<S extends boolean | null | undefined | MessageDraftDefaultArgs> = $Result.GetResult<Prisma.$MessageDraftPayload, S>

  type MessageDraftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageDraftFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageDraftCountAggregateInputType | true
    }

  export interface MessageDraftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MessageDraft'], meta: { name: 'MessageDraft' } }
    /**
     * Find zero or one MessageDraft that matches the filter.
     * @param {MessageDraftFindUniqueArgs} args - Arguments to find a MessageDraft
     * @example
     * // Get one MessageDraft
     * const messageDraft = await prisma.messageDraft.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageDraftFindUniqueArgs>(args: SelectSubset<T, MessageDraftFindUniqueArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MessageDraft that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageDraftFindUniqueOrThrowArgs} args - Arguments to find a MessageDraft
     * @example
     * // Get one MessageDraft
     * const messageDraft = await prisma.messageDraft.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageDraftFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageDraftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageDraft that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftFindFirstArgs} args - Arguments to find a MessageDraft
     * @example
     * // Get one MessageDraft
     * const messageDraft = await prisma.messageDraft.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageDraftFindFirstArgs>(args?: SelectSubset<T, MessageDraftFindFirstArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageDraft that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftFindFirstOrThrowArgs} args - Arguments to find a MessageDraft
     * @example
     * // Get one MessageDraft
     * const messageDraft = await prisma.messageDraft.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageDraftFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageDraftFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MessageDrafts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MessageDrafts
     * const messageDrafts = await prisma.messageDraft.findMany()
     * 
     * // Get first 10 MessageDrafts
     * const messageDrafts = await prisma.messageDraft.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageDraftWithIdOnly = await prisma.messageDraft.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageDraftFindManyArgs>(args?: SelectSubset<T, MessageDraftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MessageDraft.
     * @param {MessageDraftCreateArgs} args - Arguments to create a MessageDraft.
     * @example
     * // Create one MessageDraft
     * const MessageDraft = await prisma.messageDraft.create({
     *   data: {
     *     // ... data to create a MessageDraft
     *   }
     * })
     * 
     */
    create<T extends MessageDraftCreateArgs>(args: SelectSubset<T, MessageDraftCreateArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MessageDrafts.
     * @param {MessageDraftCreateManyArgs} args - Arguments to create many MessageDrafts.
     * @example
     * // Create many MessageDrafts
     * const messageDraft = await prisma.messageDraft.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageDraftCreateManyArgs>(args?: SelectSubset<T, MessageDraftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MessageDrafts and returns the data saved in the database.
     * @param {MessageDraftCreateManyAndReturnArgs} args - Arguments to create many MessageDrafts.
     * @example
     * // Create many MessageDrafts
     * const messageDraft = await prisma.messageDraft.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MessageDrafts and only return the `id`
     * const messageDraftWithIdOnly = await prisma.messageDraft.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageDraftCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageDraftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MessageDraft.
     * @param {MessageDraftDeleteArgs} args - Arguments to delete one MessageDraft.
     * @example
     * // Delete one MessageDraft
     * const MessageDraft = await prisma.messageDraft.delete({
     *   where: {
     *     // ... filter to delete one MessageDraft
     *   }
     * })
     * 
     */
    delete<T extends MessageDraftDeleteArgs>(args: SelectSubset<T, MessageDraftDeleteArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MessageDraft.
     * @param {MessageDraftUpdateArgs} args - Arguments to update one MessageDraft.
     * @example
     * // Update one MessageDraft
     * const messageDraft = await prisma.messageDraft.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageDraftUpdateArgs>(args: SelectSubset<T, MessageDraftUpdateArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MessageDrafts.
     * @param {MessageDraftDeleteManyArgs} args - Arguments to filter MessageDrafts to delete.
     * @example
     * // Delete a few MessageDrafts
     * const { count } = await prisma.messageDraft.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDraftDeleteManyArgs>(args?: SelectSubset<T, MessageDraftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageDrafts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MessageDrafts
     * const messageDraft = await prisma.messageDraft.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageDraftUpdateManyArgs>(args: SelectSubset<T, MessageDraftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageDrafts and returns the data updated in the database.
     * @param {MessageDraftUpdateManyAndReturnArgs} args - Arguments to update many MessageDrafts.
     * @example
     * // Update many MessageDrafts
     * const messageDraft = await prisma.messageDraft.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MessageDrafts and only return the `id`
     * const messageDraftWithIdOnly = await prisma.messageDraft.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageDraftUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageDraftUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MessageDraft.
     * @param {MessageDraftUpsertArgs} args - Arguments to update or create a MessageDraft.
     * @example
     * // Update or create a MessageDraft
     * const messageDraft = await prisma.messageDraft.upsert({
     *   create: {
     *     // ... data to create a MessageDraft
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MessageDraft we want to update
     *   }
     * })
     */
    upsert<T extends MessageDraftUpsertArgs>(args: SelectSubset<T, MessageDraftUpsertArgs<ExtArgs>>): Prisma__MessageDraftClient<$Result.GetResult<Prisma.$MessageDraftPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MessageDrafts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftCountArgs} args - Arguments to filter MessageDrafts to count.
     * @example
     * // Count the number of MessageDrafts
     * const count = await prisma.messageDraft.count({
     *   where: {
     *     // ... the filter for the MessageDrafts we want to count
     *   }
     * })
    **/
    count<T extends MessageDraftCountArgs>(
      args?: Subset<T, MessageDraftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageDraftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MessageDraft.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageDraftAggregateArgs>(args: Subset<T, MessageDraftAggregateArgs>): Prisma.PrismaPromise<GetMessageDraftAggregateType<T>>

    /**
     * Group by MessageDraft.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageDraftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageDraftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageDraftGroupByArgs['orderBy'] }
        : { orderBy?: MessageDraftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageDraftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageDraftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MessageDraft model
   */
  readonly fields: MessageDraftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MessageDraft.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageDraftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MessageDraft model
   */
  interface MessageDraftFieldRefs {
    readonly id: FieldRef<"MessageDraft", 'String'>
    readonly leadId: FieldRef<"MessageDraft", 'String'>
    readonly tone: FieldRef<"MessageDraft", 'String'>
    readonly body: FieldRef<"MessageDraft", 'String'>
    readonly source: FieldRef<"MessageDraft", 'String'>
    readonly selected: FieldRef<"MessageDraft", 'Boolean'>
    readonly createdAt: FieldRef<"MessageDraft", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MessageDraft findUnique
   */
  export type MessageDraftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter, which MessageDraft to fetch.
     */
    where: MessageDraftWhereUniqueInput
  }

  /**
   * MessageDraft findUniqueOrThrow
   */
  export type MessageDraftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter, which MessageDraft to fetch.
     */
    where: MessageDraftWhereUniqueInput
  }

  /**
   * MessageDraft findFirst
   */
  export type MessageDraftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter, which MessageDraft to fetch.
     */
    where?: MessageDraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageDrafts to fetch.
     */
    orderBy?: MessageDraftOrderByWithRelationInput | MessageDraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageDrafts.
     */
    cursor?: MessageDraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageDrafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageDrafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageDrafts.
     */
    distinct?: MessageDraftScalarFieldEnum | MessageDraftScalarFieldEnum[]
  }

  /**
   * MessageDraft findFirstOrThrow
   */
  export type MessageDraftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter, which MessageDraft to fetch.
     */
    where?: MessageDraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageDrafts to fetch.
     */
    orderBy?: MessageDraftOrderByWithRelationInput | MessageDraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageDrafts.
     */
    cursor?: MessageDraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageDrafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageDrafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageDrafts.
     */
    distinct?: MessageDraftScalarFieldEnum | MessageDraftScalarFieldEnum[]
  }

  /**
   * MessageDraft findMany
   */
  export type MessageDraftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter, which MessageDrafts to fetch.
     */
    where?: MessageDraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageDrafts to fetch.
     */
    orderBy?: MessageDraftOrderByWithRelationInput | MessageDraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MessageDrafts.
     */
    cursor?: MessageDraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageDrafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageDrafts.
     */
    skip?: number
    distinct?: MessageDraftScalarFieldEnum | MessageDraftScalarFieldEnum[]
  }

  /**
   * MessageDraft create
   */
  export type MessageDraftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * The data needed to create a MessageDraft.
     */
    data: XOR<MessageDraftCreateInput, MessageDraftUncheckedCreateInput>
  }

  /**
   * MessageDraft createMany
   */
  export type MessageDraftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MessageDrafts.
     */
    data: MessageDraftCreateManyInput | MessageDraftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MessageDraft createManyAndReturn
   */
  export type MessageDraftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * The data used to create many MessageDrafts.
     */
    data: MessageDraftCreateManyInput | MessageDraftCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MessageDraft update
   */
  export type MessageDraftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * The data needed to update a MessageDraft.
     */
    data: XOR<MessageDraftUpdateInput, MessageDraftUncheckedUpdateInput>
    /**
     * Choose, which MessageDraft to update.
     */
    where: MessageDraftWhereUniqueInput
  }

  /**
   * MessageDraft updateMany
   */
  export type MessageDraftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MessageDrafts.
     */
    data: XOR<MessageDraftUpdateManyMutationInput, MessageDraftUncheckedUpdateManyInput>
    /**
     * Filter which MessageDrafts to update
     */
    where?: MessageDraftWhereInput
    /**
     * Limit how many MessageDrafts to update.
     */
    limit?: number
  }

  /**
   * MessageDraft updateManyAndReturn
   */
  export type MessageDraftUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * The data used to update MessageDrafts.
     */
    data: XOR<MessageDraftUpdateManyMutationInput, MessageDraftUncheckedUpdateManyInput>
    /**
     * Filter which MessageDrafts to update
     */
    where?: MessageDraftWhereInput
    /**
     * Limit how many MessageDrafts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MessageDraft upsert
   */
  export type MessageDraftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * The filter to search for the MessageDraft to update in case it exists.
     */
    where: MessageDraftWhereUniqueInput
    /**
     * In case the MessageDraft found by the `where` argument doesn't exist, create a new MessageDraft with this data.
     */
    create: XOR<MessageDraftCreateInput, MessageDraftUncheckedCreateInput>
    /**
     * In case the MessageDraft was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageDraftUpdateInput, MessageDraftUncheckedUpdateInput>
  }

  /**
   * MessageDraft delete
   */
  export type MessageDraftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
    /**
     * Filter which MessageDraft to delete.
     */
    where: MessageDraftWhereUniqueInput
  }

  /**
   * MessageDraft deleteMany
   */
  export type MessageDraftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageDrafts to delete
     */
    where?: MessageDraftWhereInput
    /**
     * Limit how many MessageDrafts to delete.
     */
    limit?: number
  }

  /**
   * MessageDraft without action
   */
  export type MessageDraftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageDraft
     */
    select?: MessageDraftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageDraft
     */
    omit?: MessageDraftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageDraftInclude<ExtArgs> | null
  }


  /**
   * Model Activity
   */

  export type AggregateActivity = {
    _count: ActivityCountAggregateOutputType | null
    _min: ActivityMinAggregateOutputType | null
    _max: ActivityMaxAggregateOutputType | null
  }

  export type ActivityMinAggregateOutputType = {
    id: string | null
    leadId: string | null
    type: $Enums.ActivityType | null
    note: string | null
    occurredAt: Date | null
    createdAt: Date | null
  }

  export type ActivityMaxAggregateOutputType = {
    id: string | null
    leadId: string | null
    type: $Enums.ActivityType | null
    note: string | null
    occurredAt: Date | null
    createdAt: Date | null
  }

  export type ActivityCountAggregateOutputType = {
    id: number
    leadId: number
    type: number
    note: number
    occurredAt: number
    createdAt: number
    _all: number
  }


  export type ActivityMinAggregateInputType = {
    id?: true
    leadId?: true
    type?: true
    note?: true
    occurredAt?: true
    createdAt?: true
  }

  export type ActivityMaxAggregateInputType = {
    id?: true
    leadId?: true
    type?: true
    note?: true
    occurredAt?: true
    createdAt?: true
  }

  export type ActivityCountAggregateInputType = {
    id?: true
    leadId?: true
    type?: true
    note?: true
    occurredAt?: true
    createdAt?: true
    _all?: true
  }

  export type ActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Activity to aggregate.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Activities
    **/
    _count?: true | ActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivityMaxAggregateInputType
  }

  export type GetActivityAggregateType<T extends ActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivity[P]>
      : GetScalarType<T[P], AggregateActivity[P]>
  }




  export type ActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityWhereInput
    orderBy?: ActivityOrderByWithAggregationInput | ActivityOrderByWithAggregationInput[]
    by: ActivityScalarFieldEnum[] | ActivityScalarFieldEnum
    having?: ActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivityCountAggregateInputType | true
    _min?: ActivityMinAggregateInputType
    _max?: ActivityMaxAggregateInputType
  }

  export type ActivityGroupByOutputType = {
    id: string
    leadId: string
    type: $Enums.ActivityType
    note: string | null
    occurredAt: Date
    createdAt: Date
    _count: ActivityCountAggregateOutputType | null
    _min: ActivityMinAggregateOutputType | null
    _max: ActivityMaxAggregateOutputType | null
  }

  type GetActivityGroupByPayload<T extends ActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivityGroupByOutputType[P]>
            : GetScalarType<T[P], ActivityGroupByOutputType[P]>
        }
      >
    >


  export type ActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    type?: boolean
    note?: boolean
    occurredAt?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    type?: boolean
    note?: boolean
    occurredAt?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    type?: boolean
    note?: boolean
    occurredAt?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectScalar = {
    id?: boolean
    leadId?: boolean
    type?: boolean
    note?: boolean
    occurredAt?: boolean
    createdAt?: boolean
  }

  export type ActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "leadId" | "type" | "note" | "occurredAt" | "createdAt", ExtArgs["result"]["activity"]>
  export type ActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type ActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type ActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }

  export type $ActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Activity"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      leadId: string
      type: $Enums.ActivityType
      note: string | null
      occurredAt: Date
      createdAt: Date
    }, ExtArgs["result"]["activity"]>
    composites: {}
  }

  type ActivityGetPayload<S extends boolean | null | undefined | ActivityDefaultArgs> = $Result.GetResult<Prisma.$ActivityPayload, S>

  type ActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActivityCountAggregateInputType | true
    }

  export interface ActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Activity'], meta: { name: 'Activity' } }
    /**
     * Find zero or one Activity that matches the filter.
     * @param {ActivityFindUniqueArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivityFindUniqueArgs>(args: SelectSubset<T, ActivityFindUniqueArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Activity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActivityFindUniqueOrThrowArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindFirstArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivityFindFirstArgs>(args?: SelectSubset<T, ActivityFindFirstArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindFirstOrThrowArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Activities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Activities
     * const activities = await prisma.activity.findMany()
     * 
     * // Get first 10 Activities
     * const activities = await prisma.activity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activityWithIdOnly = await prisma.activity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivityFindManyArgs>(args?: SelectSubset<T, ActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Activity.
     * @param {ActivityCreateArgs} args - Arguments to create a Activity.
     * @example
     * // Create one Activity
     * const Activity = await prisma.activity.create({
     *   data: {
     *     // ... data to create a Activity
     *   }
     * })
     * 
     */
    create<T extends ActivityCreateArgs>(args: SelectSubset<T, ActivityCreateArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Activities.
     * @param {ActivityCreateManyArgs} args - Arguments to create many Activities.
     * @example
     * // Create many Activities
     * const activity = await prisma.activity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivityCreateManyArgs>(args?: SelectSubset<T, ActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Activities and returns the data saved in the database.
     * @param {ActivityCreateManyAndReturnArgs} args - Arguments to create many Activities.
     * @example
     * // Create many Activities
     * const activity = await prisma.activity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Activities and only return the `id`
     * const activityWithIdOnly = await prisma.activity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Activity.
     * @param {ActivityDeleteArgs} args - Arguments to delete one Activity.
     * @example
     * // Delete one Activity
     * const Activity = await prisma.activity.delete({
     *   where: {
     *     // ... filter to delete one Activity
     *   }
     * })
     * 
     */
    delete<T extends ActivityDeleteArgs>(args: SelectSubset<T, ActivityDeleteArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Activity.
     * @param {ActivityUpdateArgs} args - Arguments to update one Activity.
     * @example
     * // Update one Activity
     * const activity = await prisma.activity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivityUpdateArgs>(args: SelectSubset<T, ActivityUpdateArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Activities.
     * @param {ActivityDeleteManyArgs} args - Arguments to filter Activities to delete.
     * @example
     * // Delete a few Activities
     * const { count } = await prisma.activity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivityDeleteManyArgs>(args?: SelectSubset<T, ActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Activities
     * const activity = await prisma.activity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivityUpdateManyArgs>(args: SelectSubset<T, ActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activities and returns the data updated in the database.
     * @param {ActivityUpdateManyAndReturnArgs} args - Arguments to update many Activities.
     * @example
     * // Update many Activities
     * const activity = await prisma.activity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Activities and only return the `id`
     * const activityWithIdOnly = await prisma.activity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, ActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Activity.
     * @param {ActivityUpsertArgs} args - Arguments to update or create a Activity.
     * @example
     * // Update or create a Activity
     * const activity = await prisma.activity.upsert({
     *   create: {
     *     // ... data to create a Activity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Activity we want to update
     *   }
     * })
     */
    upsert<T extends ActivityUpsertArgs>(args: SelectSubset<T, ActivityUpsertArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityCountArgs} args - Arguments to filter Activities to count.
     * @example
     * // Count the number of Activities
     * const count = await prisma.activity.count({
     *   where: {
     *     // ... the filter for the Activities we want to count
     *   }
     * })
    **/
    count<T extends ActivityCountArgs>(
      args?: Subset<T, ActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivityAggregateArgs>(args: Subset<T, ActivityAggregateArgs>): Prisma.PrismaPromise<GetActivityAggregateType<T>>

    /**
     * Group by Activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivityGroupByArgs['orderBy'] }
        : { orderBy?: ActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Activity model
   */
  readonly fields: ActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Activity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Activity model
   */
  interface ActivityFieldRefs {
    readonly id: FieldRef<"Activity", 'String'>
    readonly leadId: FieldRef<"Activity", 'String'>
    readonly type: FieldRef<"Activity", 'ActivityType'>
    readonly note: FieldRef<"Activity", 'String'>
    readonly occurredAt: FieldRef<"Activity", 'DateTime'>
    readonly createdAt: FieldRef<"Activity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Activity findUnique
   */
  export type ActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity findUniqueOrThrow
   */
  export type ActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity findFirst
   */
  export type ActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Activities.
     */
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity findFirstOrThrow
   */
  export type ActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Activities.
     */
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity findMany
   */
  export type ActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activities to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity create
   */
  export type ActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a Activity.
     */
    data: XOR<ActivityCreateInput, ActivityUncheckedCreateInput>
  }

  /**
   * Activity createMany
   */
  export type ActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Activities.
     */
    data: ActivityCreateManyInput | ActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Activity createManyAndReturn
   */
  export type ActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * The data used to create many Activities.
     */
    data: ActivityCreateManyInput | ActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Activity update
   */
  export type ActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a Activity.
     */
    data: XOR<ActivityUpdateInput, ActivityUncheckedUpdateInput>
    /**
     * Choose, which Activity to update.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity updateMany
   */
  export type ActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Activities.
     */
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyInput>
    /**
     * Filter which Activities to update
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to update.
     */
    limit?: number
  }

  /**
   * Activity updateManyAndReturn
   */
  export type ActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * The data used to update Activities.
     */
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyInput>
    /**
     * Filter which Activities to update
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Activity upsert
   */
  export type ActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the Activity to update in case it exists.
     */
    where: ActivityWhereUniqueInput
    /**
     * In case the Activity found by the `where` argument doesn't exist, create a new Activity with this data.
     */
    create: XOR<ActivityCreateInput, ActivityUncheckedCreateInput>
    /**
     * In case the Activity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivityUpdateInput, ActivityUncheckedUpdateInput>
  }

  /**
   * Activity delete
   */
  export type ActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter which Activity to delete.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity deleteMany
   */
  export type ActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Activities to delete
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to delete.
     */
    limit?: number
  }

  /**
   * Activity without action
   */
  export type ActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    rating: number | null
  }

  export type ProjectSumAggregateOutputType = {
    rating: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    artistId: string | null
    title: string | null
    portalToken: string | null
    status: $Enums.ProjectStatus | null
    rating: number | null
    review: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    artistId: string | null
    title: string | null
    portalToken: string | null
    status: $Enums.ProjectStatus | null
    rating: number | null
    review: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    artistId: number
    title: number
    portalToken: number
    status: number
    rating: number
    review: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    rating?: true
  }

  export type ProjectSumAggregateInputType = {
    rating?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    artistId?: true
    title?: true
    portalToken?: true
    status?: true
    rating?: true
    review?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    artistId?: true
    title?: true
    portalToken?: true
    status?: true
    rating?: true
    review?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    artistId?: true
    title?: true
    portalToken?: true
    status?: true
    rating?: true
    review?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    artistId: string
    title: string | null
    portalToken: string
    status: $Enums.ProjectStatus
    rating: number | null
    review: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    title?: boolean
    portalToken?: boolean
    status?: boolean
    rating?: boolean
    review?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    feedbacks?: boolean | Project$feedbacksArgs<ExtArgs>
    invoice?: boolean | Project$invoiceArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    title?: boolean
    portalToken?: boolean
    status?: boolean
    rating?: boolean
    review?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    title?: boolean
    portalToken?: boolean
    status?: boolean
    rating?: boolean
    review?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    artistId?: boolean
    title?: boolean
    portalToken?: boolean
    status?: boolean
    rating?: boolean
    review?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "artistId" | "title" | "portalToken" | "status" | "rating" | "review" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    feedbacks?: boolean | Project$feedbacksArgs<ExtArgs>
    invoice?: boolean | Project$invoiceArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      artist: Prisma.$ArtistPayload<ExtArgs>
      files: Prisma.$ProjectFilePayload<ExtArgs>[]
      feedbacks: Prisma.$ProjectFeedbackPayload<ExtArgs>[]
      invoice: Prisma.$ProjectInvoicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      artistId: string
      title: string | null
      portalToken: string
      status: $Enums.ProjectStatus
      rating: number | null
      review: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    artist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedbacks<T extends Project$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, Project$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoice<T extends Project$invoiceArgs<ExtArgs> = {}>(args?: Subset<T, Project$invoiceArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly artistId: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly portalToken: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly rating: FieldRef<"Project", 'Int'>
    readonly review: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * Project.feedbacks
   */
  export type Project$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    where?: ProjectFeedbackWhereInput
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    cursor?: ProjectFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFeedbackScalarFieldEnum | ProjectFeedbackScalarFieldEnum[]
  }

  /**
   * Project.invoice
   */
  export type Project$invoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    where?: ProjectInvoiceWhereInput
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileAvgAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileSumAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    url: string | null
    key: string | null
    size: number | null
    mimeType: string | null
    type: $Enums.FileType | null
    isPublic: boolean | null
    createdAt: Date | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    url: string | null
    key: string | null
    size: number | null
    mimeType: string | null
    type: $Enums.FileType | null
    isPublic: boolean | null
    createdAt: Date | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    url: number
    key: number
    size: number
    mimeType: number
    type: number
    isPublic: number
    createdAt: number
    _all: number
  }


  export type ProjectFileAvgAggregateInputType = {
    size?: true
  }

  export type ProjectFileSumAggregateInputType = {
    size?: true
  }

  export type ProjectFileMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    url?: true
    key?: true
    size?: true
    mimeType?: true
    type?: true
    isPublic?: true
    createdAt?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    url?: true
    key?: true
    size?: true
    mimeType?: true
    type?: true
    isPublic?: true
    createdAt?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    url?: true
    key?: true
    size?: true
    mimeType?: true
    type?: true
    isPublic?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _avg?: ProjectFileAvgAggregateInputType
    _sum?: ProjectFileSumAggregateInputType
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    projectId: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type: $Enums.FileType
    isPublic: boolean
    createdAt: Date
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    url?: boolean
    key?: boolean
    size?: boolean
    mimeType?: boolean
    type?: boolean
    isPublic?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    feedbacks?: boolean | ProjectFile$feedbacksArgs<ExtArgs>
    _count?: boolean | ProjectFileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    url?: boolean
    key?: boolean
    size?: boolean
    mimeType?: boolean
    type?: boolean
    isPublic?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    url?: boolean
    key?: boolean
    size?: boolean
    mimeType?: boolean
    type?: boolean
    isPublic?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    url?: boolean
    key?: boolean
    size?: boolean
    mimeType?: boolean
    type?: boolean
    isPublic?: boolean
    createdAt?: boolean
  }

  export type ProjectFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "name" | "url" | "key" | "size" | "mimeType" | "type" | "isPublic" | "createdAt", ExtArgs["result"]["projectFile"]>
  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    feedbacks?: boolean | ProjectFile$feedbacksArgs<ExtArgs>
    _count?: boolean | ProjectFileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      feedbacks: Prisma.$ProjectFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      url: string
      key: string
      size: number
      mimeType: string
      type: $Enums.FileType
      isPublic: boolean
      createdAt: Date
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles and returns the data updated in the database.
     * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    feedbacks<T extends ProjectFile$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, ProjectFile$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectFile model
   */
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly projectId: FieldRef<"ProjectFile", 'String'>
    readonly name: FieldRef<"ProjectFile", 'String'>
    readonly url: FieldRef<"ProjectFile", 'String'>
    readonly key: FieldRef<"ProjectFile", 'String'>
    readonly size: FieldRef<"ProjectFile", 'Int'>
    readonly mimeType: FieldRef<"ProjectFile", 'String'>
    readonly type: FieldRef<"ProjectFile", 'FileType'>
    readonly isPublic: FieldRef<"ProjectFile", 'Boolean'>
    readonly createdAt: FieldRef<"ProjectFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
  }

  /**
   * ProjectFile updateManyAndReturn
   */
  export type ProjectFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to delete.
     */
    limit?: number
  }

  /**
   * ProjectFile.feedbacks
   */
  export type ProjectFile$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    where?: ProjectFeedbackWhereInput
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    cursor?: ProjectFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFeedbackScalarFieldEnum | ProjectFeedbackScalarFieldEnum[]
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFeedback
   */

  export type AggregateProjectFeedback = {
    _count: ProjectFeedbackCountAggregateOutputType | null
    _avg: ProjectFeedbackAvgAggregateOutputType | null
    _sum: ProjectFeedbackSumAggregateOutputType | null
    _min: ProjectFeedbackMinAggregateOutputType | null
    _max: ProjectFeedbackMaxAggregateOutputType | null
  }

  export type ProjectFeedbackAvgAggregateOutputType = {
    timestamp: number | null
  }

  export type ProjectFeedbackSumAggregateOutputType = {
    timestamp: number | null
  }

  export type ProjectFeedbackMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    content: string | null
    resolved: boolean | null
    createdAt: Date | null
    fileId: string | null
    timestamp: number | null
  }

  export type ProjectFeedbackMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    content: string | null
    resolved: boolean | null
    createdAt: Date | null
    fileId: string | null
    timestamp: number | null
  }

  export type ProjectFeedbackCountAggregateOutputType = {
    id: number
    projectId: number
    content: number
    resolved: number
    createdAt: number
    fileId: number
    timestamp: number
    _all: number
  }


  export type ProjectFeedbackAvgAggregateInputType = {
    timestamp?: true
  }

  export type ProjectFeedbackSumAggregateInputType = {
    timestamp?: true
  }

  export type ProjectFeedbackMinAggregateInputType = {
    id?: true
    projectId?: true
    content?: true
    resolved?: true
    createdAt?: true
    fileId?: true
    timestamp?: true
  }

  export type ProjectFeedbackMaxAggregateInputType = {
    id?: true
    projectId?: true
    content?: true
    resolved?: true
    createdAt?: true
    fileId?: true
    timestamp?: true
  }

  export type ProjectFeedbackCountAggregateInputType = {
    id?: true
    projectId?: true
    content?: true
    resolved?: true
    createdAt?: true
    fileId?: true
    timestamp?: true
    _all?: true
  }

  export type ProjectFeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFeedback to aggregate.
     */
    where?: ProjectFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFeedbacks to fetch.
     */
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFeedbacks
    **/
    _count?: true | ProjectFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFeedbackMaxAggregateInputType
  }

  export type GetProjectFeedbackAggregateType<T extends ProjectFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFeedback[P]>
      : GetScalarType<T[P], AggregateProjectFeedback[P]>
  }




  export type ProjectFeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFeedbackWhereInput
    orderBy?: ProjectFeedbackOrderByWithAggregationInput | ProjectFeedbackOrderByWithAggregationInput[]
    by: ProjectFeedbackScalarFieldEnum[] | ProjectFeedbackScalarFieldEnum
    having?: ProjectFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFeedbackCountAggregateInputType | true
    _avg?: ProjectFeedbackAvgAggregateInputType
    _sum?: ProjectFeedbackSumAggregateInputType
    _min?: ProjectFeedbackMinAggregateInputType
    _max?: ProjectFeedbackMaxAggregateInputType
  }

  export type ProjectFeedbackGroupByOutputType = {
    id: string
    projectId: string
    content: string
    resolved: boolean
    createdAt: Date
    fileId: string | null
    timestamp: number | null
    _count: ProjectFeedbackCountAggregateOutputType | null
    _avg: ProjectFeedbackAvgAggregateOutputType | null
    _sum: ProjectFeedbackSumAggregateOutputType | null
    _min: ProjectFeedbackMinAggregateOutputType | null
    _max: ProjectFeedbackMaxAggregateOutputType | null
  }

  type GetProjectFeedbackGroupByPayload<T extends ProjectFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    content?: boolean
    resolved?: boolean
    createdAt?: boolean
    fileId?: boolean
    timestamp?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }, ExtArgs["result"]["projectFeedback"]>

  export type ProjectFeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    content?: boolean
    resolved?: boolean
    createdAt?: boolean
    fileId?: boolean
    timestamp?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }, ExtArgs["result"]["projectFeedback"]>

  export type ProjectFeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    content?: boolean
    resolved?: boolean
    createdAt?: boolean
    fileId?: boolean
    timestamp?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }, ExtArgs["result"]["projectFeedback"]>

  export type ProjectFeedbackSelectScalar = {
    id?: boolean
    projectId?: boolean
    content?: boolean
    resolved?: boolean
    createdAt?: boolean
    fileId?: boolean
    timestamp?: boolean
  }

  export type ProjectFeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "content" | "resolved" | "createdAt" | "fileId" | "timestamp", ExtArgs["result"]["projectFeedback"]>
  export type ProjectFeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }
  export type ProjectFeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }
  export type ProjectFeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    file?: boolean | ProjectFeedback$fileArgs<ExtArgs>
  }

  export type $ProjectFeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFeedback"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      file: Prisma.$ProjectFilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      content: string
      resolved: boolean
      createdAt: Date
      fileId: string | null
      timestamp: number | null
    }, ExtArgs["result"]["projectFeedback"]>
    composites: {}
  }

  type ProjectFeedbackGetPayload<S extends boolean | null | undefined | ProjectFeedbackDefaultArgs> = $Result.GetResult<Prisma.$ProjectFeedbackPayload, S>

  type ProjectFeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFeedbackCountAggregateInputType | true
    }

  export interface ProjectFeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFeedback'], meta: { name: 'ProjectFeedback' } }
    /**
     * Find zero or one ProjectFeedback that matches the filter.
     * @param {ProjectFeedbackFindUniqueArgs} args - Arguments to find a ProjectFeedback
     * @example
     * // Get one ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFeedbackFindUniqueArgs>(args: SelectSubset<T, ProjectFeedbackFindUniqueArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFeedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFeedbackFindUniqueOrThrowArgs} args - Arguments to find a ProjectFeedback
     * @example
     * // Get one ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackFindFirstArgs} args - Arguments to find a ProjectFeedback
     * @example
     * // Get one ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFeedbackFindFirstArgs>(args?: SelectSubset<T, ProjectFeedbackFindFirstArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFeedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackFindFirstOrThrowArgs} args - Arguments to find a ProjectFeedback
     * @example
     * // Get one ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFeedbacks
     * const projectFeedbacks = await prisma.projectFeedback.findMany()
     * 
     * // Get first 10 ProjectFeedbacks
     * const projectFeedbacks = await prisma.projectFeedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFeedbackWithIdOnly = await prisma.projectFeedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFeedbackFindManyArgs>(args?: SelectSubset<T, ProjectFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFeedback.
     * @param {ProjectFeedbackCreateArgs} args - Arguments to create a ProjectFeedback.
     * @example
     * // Create one ProjectFeedback
     * const ProjectFeedback = await prisma.projectFeedback.create({
     *   data: {
     *     // ... data to create a ProjectFeedback
     *   }
     * })
     * 
     */
    create<T extends ProjectFeedbackCreateArgs>(args: SelectSubset<T, ProjectFeedbackCreateArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFeedbacks.
     * @param {ProjectFeedbackCreateManyArgs} args - Arguments to create many ProjectFeedbacks.
     * @example
     * // Create many ProjectFeedbacks
     * const projectFeedback = await prisma.projectFeedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFeedbackCreateManyArgs>(args?: SelectSubset<T, ProjectFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFeedbacks and returns the data saved in the database.
     * @param {ProjectFeedbackCreateManyAndReturnArgs} args - Arguments to create many ProjectFeedbacks.
     * @example
     * // Create many ProjectFeedbacks
     * const projectFeedback = await prisma.projectFeedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFeedbacks and only return the `id`
     * const projectFeedbackWithIdOnly = await prisma.projectFeedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFeedback.
     * @param {ProjectFeedbackDeleteArgs} args - Arguments to delete one ProjectFeedback.
     * @example
     * // Delete one ProjectFeedback
     * const ProjectFeedback = await prisma.projectFeedback.delete({
     *   where: {
     *     // ... filter to delete one ProjectFeedback
     *   }
     * })
     * 
     */
    delete<T extends ProjectFeedbackDeleteArgs>(args: SelectSubset<T, ProjectFeedbackDeleteArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFeedback.
     * @param {ProjectFeedbackUpdateArgs} args - Arguments to update one ProjectFeedback.
     * @example
     * // Update one ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFeedbackUpdateArgs>(args: SelectSubset<T, ProjectFeedbackUpdateArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFeedbacks.
     * @param {ProjectFeedbackDeleteManyArgs} args - Arguments to filter ProjectFeedbacks to delete.
     * @example
     * // Delete a few ProjectFeedbacks
     * const { count } = await prisma.projectFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFeedbackDeleteManyArgs>(args?: SelectSubset<T, ProjectFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFeedbacks
     * const projectFeedback = await prisma.projectFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFeedbackUpdateManyArgs>(args: SelectSubset<T, ProjectFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFeedbacks and returns the data updated in the database.
     * @param {ProjectFeedbackUpdateManyAndReturnArgs} args - Arguments to update many ProjectFeedbacks.
     * @example
     * // Update many ProjectFeedbacks
     * const projectFeedback = await prisma.projectFeedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFeedbacks and only return the `id`
     * const projectFeedbackWithIdOnly = await prisma.projectFeedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectFeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFeedback.
     * @param {ProjectFeedbackUpsertArgs} args - Arguments to update or create a ProjectFeedback.
     * @example
     * // Update or create a ProjectFeedback
     * const projectFeedback = await prisma.projectFeedback.upsert({
     *   create: {
     *     // ... data to create a ProjectFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFeedback we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFeedbackUpsertArgs>(args: SelectSubset<T, ProjectFeedbackUpsertArgs<ExtArgs>>): Prisma__ProjectFeedbackClient<$Result.GetResult<Prisma.$ProjectFeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackCountArgs} args - Arguments to filter ProjectFeedbacks to count.
     * @example
     * // Count the number of ProjectFeedbacks
     * const count = await prisma.projectFeedback.count({
     *   where: {
     *     // ... the filter for the ProjectFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends ProjectFeedbackCountArgs>(
      args?: Subset<T, ProjectFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectFeedbackAggregateArgs>(args: Subset<T, ProjectFeedbackAggregateArgs>): Prisma.PrismaPromise<GetProjectFeedbackAggregateType<T>>

    /**
     * Group by ProjectFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFeedback model
   */
  readonly fields: ProjectFeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    file<T extends ProjectFeedback$fileArgs<ExtArgs> = {}>(args?: Subset<T, ProjectFeedback$fileArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectFeedback model
   */
  interface ProjectFeedbackFieldRefs {
    readonly id: FieldRef<"ProjectFeedback", 'String'>
    readonly projectId: FieldRef<"ProjectFeedback", 'String'>
    readonly content: FieldRef<"ProjectFeedback", 'String'>
    readonly resolved: FieldRef<"ProjectFeedback", 'Boolean'>
    readonly createdAt: FieldRef<"ProjectFeedback", 'DateTime'>
    readonly fileId: FieldRef<"ProjectFeedback", 'String'>
    readonly timestamp: FieldRef<"ProjectFeedback", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFeedback findUnique
   */
  export type ProjectFeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFeedback to fetch.
     */
    where: ProjectFeedbackWhereUniqueInput
  }

  /**
   * ProjectFeedback findUniqueOrThrow
   */
  export type ProjectFeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFeedback to fetch.
     */
    where: ProjectFeedbackWhereUniqueInput
  }

  /**
   * ProjectFeedback findFirst
   */
  export type ProjectFeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFeedback to fetch.
     */
    where?: ProjectFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFeedbacks to fetch.
     */
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFeedbacks.
     */
    cursor?: ProjectFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFeedbacks.
     */
    distinct?: ProjectFeedbackScalarFieldEnum | ProjectFeedbackScalarFieldEnum[]
  }

  /**
   * ProjectFeedback findFirstOrThrow
   */
  export type ProjectFeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFeedback to fetch.
     */
    where?: ProjectFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFeedbacks to fetch.
     */
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFeedbacks.
     */
    cursor?: ProjectFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFeedbacks.
     */
    distinct?: ProjectFeedbackScalarFieldEnum | ProjectFeedbackScalarFieldEnum[]
  }

  /**
   * ProjectFeedback findMany
   */
  export type ProjectFeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFeedbacks to fetch.
     */
    where?: ProjectFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFeedbacks to fetch.
     */
    orderBy?: ProjectFeedbackOrderByWithRelationInput | ProjectFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFeedbacks.
     */
    cursor?: ProjectFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFeedbacks.
     */
    skip?: number
    distinct?: ProjectFeedbackScalarFieldEnum | ProjectFeedbackScalarFieldEnum[]
  }

  /**
   * ProjectFeedback create
   */
  export type ProjectFeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFeedback.
     */
    data: XOR<ProjectFeedbackCreateInput, ProjectFeedbackUncheckedCreateInput>
  }

  /**
   * ProjectFeedback createMany
   */
  export type ProjectFeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFeedbacks.
     */
    data: ProjectFeedbackCreateManyInput | ProjectFeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFeedback createManyAndReturn
   */
  export type ProjectFeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFeedbacks.
     */
    data: ProjectFeedbackCreateManyInput | ProjectFeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFeedback update
   */
  export type ProjectFeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFeedback.
     */
    data: XOR<ProjectFeedbackUpdateInput, ProjectFeedbackUncheckedUpdateInput>
    /**
     * Choose, which ProjectFeedback to update.
     */
    where: ProjectFeedbackWhereUniqueInput
  }

  /**
   * ProjectFeedback updateMany
   */
  export type ProjectFeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFeedbacks.
     */
    data: XOR<ProjectFeedbackUpdateManyMutationInput, ProjectFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFeedbacks to update
     */
    where?: ProjectFeedbackWhereInput
    /**
     * Limit how many ProjectFeedbacks to update.
     */
    limit?: number
  }

  /**
   * ProjectFeedback updateManyAndReturn
   */
  export type ProjectFeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFeedbacks.
     */
    data: XOR<ProjectFeedbackUpdateManyMutationInput, ProjectFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFeedbacks to update
     */
    where?: ProjectFeedbackWhereInput
    /**
     * Limit how many ProjectFeedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFeedback upsert
   */
  export type ProjectFeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFeedback to update in case it exists.
     */
    where: ProjectFeedbackWhereUniqueInput
    /**
     * In case the ProjectFeedback found by the `where` argument doesn't exist, create a new ProjectFeedback with this data.
     */
    create: XOR<ProjectFeedbackCreateInput, ProjectFeedbackUncheckedCreateInput>
    /**
     * In case the ProjectFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFeedbackUpdateInput, ProjectFeedbackUncheckedUpdateInput>
  }

  /**
   * ProjectFeedback delete
   */
  export type ProjectFeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
    /**
     * Filter which ProjectFeedback to delete.
     */
    where: ProjectFeedbackWhereUniqueInput
  }

  /**
   * ProjectFeedback deleteMany
   */
  export type ProjectFeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFeedbacks to delete
     */
    where?: ProjectFeedbackWhereInput
    /**
     * Limit how many ProjectFeedbacks to delete.
     */
    limit?: number
  }

  /**
   * ProjectFeedback.file
   */
  export type ProjectFeedback$fileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectFeedback without action
   */
  export type ProjectFeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFeedback
     */
    select?: ProjectFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFeedback
     */
    omit?: ProjectFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFeedbackInclude<ExtArgs> | null
  }


  /**
   * Model ProjectInvoice
   */

  export type AggregateProjectInvoice = {
    _count: ProjectInvoiceCountAggregateOutputType | null
    _avg: ProjectInvoiceAvgAggregateOutputType | null
    _sum: ProjectInvoiceSumAggregateOutputType | null
    _min: ProjectInvoiceMinAggregateOutputType | null
    _max: ProjectInvoiceMaxAggregateOutputType | null
  }

  export type ProjectInvoiceAvgAggregateOutputType = {
    subtotalCents: number | null
    taxCents: number | null
    totalCents: number | null
  }

  export type ProjectInvoiceSumAggregateOutputType = {
    subtotalCents: number | null
    taxCents: number | null
    totalCents: number | null
  }

  export type ProjectInvoiceMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    invoiceNumber: string | null
    issuedAt: Date | null
    dueAt: Date | null
    currency: string | null
    subtotalCents: number | null
    taxCents: number | null
    totalCents: number | null
    notes: string | null
    stripePaymentUrl: string | null
    paidAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectInvoiceMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    invoiceNumber: string | null
    issuedAt: Date | null
    dueAt: Date | null
    currency: string | null
    subtotalCents: number | null
    taxCents: number | null
    totalCents: number | null
    notes: string | null
    stripePaymentUrl: string | null
    paidAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectInvoiceCountAggregateOutputType = {
    id: number
    projectId: number
    invoiceNumber: number
    issuedAt: number
    dueAt: number
    currency: number
    lineItems: number
    subtotalCents: number
    taxCents: number
    totalCents: number
    notes: number
    stripePaymentUrl: number
    paidAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectInvoiceAvgAggregateInputType = {
    subtotalCents?: true
    taxCents?: true
    totalCents?: true
  }

  export type ProjectInvoiceSumAggregateInputType = {
    subtotalCents?: true
    taxCents?: true
    totalCents?: true
  }

  export type ProjectInvoiceMinAggregateInputType = {
    id?: true
    projectId?: true
    invoiceNumber?: true
    issuedAt?: true
    dueAt?: true
    currency?: true
    subtotalCents?: true
    taxCents?: true
    totalCents?: true
    notes?: true
    stripePaymentUrl?: true
    paidAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectInvoiceMaxAggregateInputType = {
    id?: true
    projectId?: true
    invoiceNumber?: true
    issuedAt?: true
    dueAt?: true
    currency?: true
    subtotalCents?: true
    taxCents?: true
    totalCents?: true
    notes?: true
    stripePaymentUrl?: true
    paidAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectInvoiceCountAggregateInputType = {
    id?: true
    projectId?: true
    invoiceNumber?: true
    issuedAt?: true
    dueAt?: true
    currency?: true
    lineItems?: true
    subtotalCents?: true
    taxCents?: true
    totalCents?: true
    notes?: true
    stripePaymentUrl?: true
    paidAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectInvoice to aggregate.
     */
    where?: ProjectInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectInvoices to fetch.
     */
    orderBy?: ProjectInvoiceOrderByWithRelationInput | ProjectInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectInvoices
    **/
    _count?: true | ProjectInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectInvoiceMaxAggregateInputType
  }

  export type GetProjectInvoiceAggregateType<T extends ProjectInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectInvoice[P]>
      : GetScalarType<T[P], AggregateProjectInvoice[P]>
  }




  export type ProjectInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectInvoiceWhereInput
    orderBy?: ProjectInvoiceOrderByWithAggregationInput | ProjectInvoiceOrderByWithAggregationInput[]
    by: ProjectInvoiceScalarFieldEnum[] | ProjectInvoiceScalarFieldEnum
    having?: ProjectInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectInvoiceCountAggregateInputType | true
    _avg?: ProjectInvoiceAvgAggregateInputType
    _sum?: ProjectInvoiceSumAggregateInputType
    _min?: ProjectInvoiceMinAggregateInputType
    _max?: ProjectInvoiceMaxAggregateInputType
  }

  export type ProjectInvoiceGroupByOutputType = {
    id: string
    projectId: string
    invoiceNumber: string
    issuedAt: Date
    dueAt: Date | null
    currency: string
    lineItems: JsonValue
    subtotalCents: number
    taxCents: number
    totalCents: number
    notes: string | null
    stripePaymentUrl: string | null
    paidAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectInvoiceCountAggregateOutputType | null
    _avg: ProjectInvoiceAvgAggregateOutputType | null
    _sum: ProjectInvoiceSumAggregateOutputType | null
    _min: ProjectInvoiceMinAggregateOutputType | null
    _max: ProjectInvoiceMaxAggregateOutputType | null
  }

  type GetProjectInvoiceGroupByPayload<T extends ProjectInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type ProjectInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    invoiceNumber?: boolean
    issuedAt?: boolean
    dueAt?: boolean
    currency?: boolean
    lineItems?: boolean
    subtotalCents?: boolean
    taxCents?: boolean
    totalCents?: boolean
    notes?: boolean
    stripePaymentUrl?: boolean
    paidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectInvoice"]>

  export type ProjectInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    invoiceNumber?: boolean
    issuedAt?: boolean
    dueAt?: boolean
    currency?: boolean
    lineItems?: boolean
    subtotalCents?: boolean
    taxCents?: boolean
    totalCents?: boolean
    notes?: boolean
    stripePaymentUrl?: boolean
    paidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectInvoice"]>

  export type ProjectInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    invoiceNumber?: boolean
    issuedAt?: boolean
    dueAt?: boolean
    currency?: boolean
    lineItems?: boolean
    subtotalCents?: boolean
    taxCents?: boolean
    totalCents?: boolean
    notes?: boolean
    stripePaymentUrl?: boolean
    paidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectInvoice"]>

  export type ProjectInvoiceSelectScalar = {
    id?: boolean
    projectId?: boolean
    invoiceNumber?: boolean
    issuedAt?: boolean
    dueAt?: boolean
    currency?: boolean
    lineItems?: boolean
    subtotalCents?: boolean
    taxCents?: boolean
    totalCents?: boolean
    notes?: boolean
    stripePaymentUrl?: boolean
    paidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "invoiceNumber" | "issuedAt" | "dueAt" | "currency" | "lineItems" | "subtotalCents" | "taxCents" | "totalCents" | "notes" | "stripePaymentUrl" | "paidAt" | "createdAt" | "updatedAt", ExtArgs["result"]["projectInvoice"]>
  export type ProjectInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectInvoice"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      invoiceNumber: string
      issuedAt: Date
      dueAt: Date | null
      currency: string
      lineItems: Prisma.JsonValue
      subtotalCents: number
      taxCents: number
      totalCents: number
      notes: string | null
      stripePaymentUrl: string | null
      paidAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["projectInvoice"]>
    composites: {}
  }

  type ProjectInvoiceGetPayload<S extends boolean | null | undefined | ProjectInvoiceDefaultArgs> = $Result.GetResult<Prisma.$ProjectInvoicePayload, S>

  type ProjectInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectInvoiceCountAggregateInputType | true
    }

  export interface ProjectInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectInvoice'], meta: { name: 'ProjectInvoice' } }
    /**
     * Find zero or one ProjectInvoice that matches the filter.
     * @param {ProjectInvoiceFindUniqueArgs} args - Arguments to find a ProjectInvoice
     * @example
     * // Get one ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectInvoiceFindUniqueArgs>(args: SelectSubset<T, ProjectInvoiceFindUniqueArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectInvoiceFindUniqueOrThrowArgs} args - Arguments to find a ProjectInvoice
     * @example
     * // Get one ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceFindFirstArgs} args - Arguments to find a ProjectInvoice
     * @example
     * // Get one ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectInvoiceFindFirstArgs>(args?: SelectSubset<T, ProjectInvoiceFindFirstArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceFindFirstOrThrowArgs} args - Arguments to find a ProjectInvoice
     * @example
     * // Get one ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectInvoices
     * const projectInvoices = await prisma.projectInvoice.findMany()
     * 
     * // Get first 10 ProjectInvoices
     * const projectInvoices = await prisma.projectInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectInvoiceWithIdOnly = await prisma.projectInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectInvoiceFindManyArgs>(args?: SelectSubset<T, ProjectInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectInvoice.
     * @param {ProjectInvoiceCreateArgs} args - Arguments to create a ProjectInvoice.
     * @example
     * // Create one ProjectInvoice
     * const ProjectInvoice = await prisma.projectInvoice.create({
     *   data: {
     *     // ... data to create a ProjectInvoice
     *   }
     * })
     * 
     */
    create<T extends ProjectInvoiceCreateArgs>(args: SelectSubset<T, ProjectInvoiceCreateArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectInvoices.
     * @param {ProjectInvoiceCreateManyArgs} args - Arguments to create many ProjectInvoices.
     * @example
     * // Create many ProjectInvoices
     * const projectInvoice = await prisma.projectInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectInvoiceCreateManyArgs>(args?: SelectSubset<T, ProjectInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectInvoices and returns the data saved in the database.
     * @param {ProjectInvoiceCreateManyAndReturnArgs} args - Arguments to create many ProjectInvoices.
     * @example
     * // Create many ProjectInvoices
     * const projectInvoice = await prisma.projectInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectInvoices and only return the `id`
     * const projectInvoiceWithIdOnly = await prisma.projectInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectInvoice.
     * @param {ProjectInvoiceDeleteArgs} args - Arguments to delete one ProjectInvoice.
     * @example
     * // Delete one ProjectInvoice
     * const ProjectInvoice = await prisma.projectInvoice.delete({
     *   where: {
     *     // ... filter to delete one ProjectInvoice
     *   }
     * })
     * 
     */
    delete<T extends ProjectInvoiceDeleteArgs>(args: SelectSubset<T, ProjectInvoiceDeleteArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectInvoice.
     * @param {ProjectInvoiceUpdateArgs} args - Arguments to update one ProjectInvoice.
     * @example
     * // Update one ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectInvoiceUpdateArgs>(args: SelectSubset<T, ProjectInvoiceUpdateArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectInvoices.
     * @param {ProjectInvoiceDeleteManyArgs} args - Arguments to filter ProjectInvoices to delete.
     * @example
     * // Delete a few ProjectInvoices
     * const { count } = await prisma.projectInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectInvoiceDeleteManyArgs>(args?: SelectSubset<T, ProjectInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectInvoices
     * const projectInvoice = await prisma.projectInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectInvoiceUpdateManyArgs>(args: SelectSubset<T, ProjectInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectInvoices and returns the data updated in the database.
     * @param {ProjectInvoiceUpdateManyAndReturnArgs} args - Arguments to update many ProjectInvoices.
     * @example
     * // Update many ProjectInvoices
     * const projectInvoice = await prisma.projectInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectInvoices and only return the `id`
     * const projectInvoiceWithIdOnly = await prisma.projectInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectInvoice.
     * @param {ProjectInvoiceUpsertArgs} args - Arguments to update or create a ProjectInvoice.
     * @example
     * // Update or create a ProjectInvoice
     * const projectInvoice = await prisma.projectInvoice.upsert({
     *   create: {
     *     // ... data to create a ProjectInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectInvoice we want to update
     *   }
     * })
     */
    upsert<T extends ProjectInvoiceUpsertArgs>(args: SelectSubset<T, ProjectInvoiceUpsertArgs<ExtArgs>>): Prisma__ProjectInvoiceClient<$Result.GetResult<Prisma.$ProjectInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceCountArgs} args - Arguments to filter ProjectInvoices to count.
     * @example
     * // Count the number of ProjectInvoices
     * const count = await prisma.projectInvoice.count({
     *   where: {
     *     // ... the filter for the ProjectInvoices we want to count
     *   }
     * })
    **/
    count<T extends ProjectInvoiceCountArgs>(
      args?: Subset<T, ProjectInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectInvoiceAggregateArgs>(args: Subset<T, ProjectInvoiceAggregateArgs>): Prisma.PrismaPromise<GetProjectInvoiceAggregateType<T>>

    /**
     * Group by ProjectInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: ProjectInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectInvoice model
   */
  readonly fields: ProjectInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectInvoice model
   */
  interface ProjectInvoiceFieldRefs {
    readonly id: FieldRef<"ProjectInvoice", 'String'>
    readonly projectId: FieldRef<"ProjectInvoice", 'String'>
    readonly invoiceNumber: FieldRef<"ProjectInvoice", 'String'>
    readonly issuedAt: FieldRef<"ProjectInvoice", 'DateTime'>
    readonly dueAt: FieldRef<"ProjectInvoice", 'DateTime'>
    readonly currency: FieldRef<"ProjectInvoice", 'String'>
    readonly lineItems: FieldRef<"ProjectInvoice", 'Json'>
    readonly subtotalCents: FieldRef<"ProjectInvoice", 'Int'>
    readonly taxCents: FieldRef<"ProjectInvoice", 'Int'>
    readonly totalCents: FieldRef<"ProjectInvoice", 'Int'>
    readonly notes: FieldRef<"ProjectInvoice", 'String'>
    readonly stripePaymentUrl: FieldRef<"ProjectInvoice", 'String'>
    readonly paidAt: FieldRef<"ProjectInvoice", 'DateTime'>
    readonly createdAt: FieldRef<"ProjectInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"ProjectInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectInvoice findUnique
   */
  export type ProjectInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which ProjectInvoice to fetch.
     */
    where: ProjectInvoiceWhereUniqueInput
  }

  /**
   * ProjectInvoice findUniqueOrThrow
   */
  export type ProjectInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which ProjectInvoice to fetch.
     */
    where: ProjectInvoiceWhereUniqueInput
  }

  /**
   * ProjectInvoice findFirst
   */
  export type ProjectInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which ProjectInvoice to fetch.
     */
    where?: ProjectInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectInvoices to fetch.
     */
    orderBy?: ProjectInvoiceOrderByWithRelationInput | ProjectInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectInvoices.
     */
    cursor?: ProjectInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectInvoices.
     */
    distinct?: ProjectInvoiceScalarFieldEnum | ProjectInvoiceScalarFieldEnum[]
  }

  /**
   * ProjectInvoice findFirstOrThrow
   */
  export type ProjectInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which ProjectInvoice to fetch.
     */
    where?: ProjectInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectInvoices to fetch.
     */
    orderBy?: ProjectInvoiceOrderByWithRelationInput | ProjectInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectInvoices.
     */
    cursor?: ProjectInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectInvoices.
     */
    distinct?: ProjectInvoiceScalarFieldEnum | ProjectInvoiceScalarFieldEnum[]
  }

  /**
   * ProjectInvoice findMany
   */
  export type ProjectInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which ProjectInvoices to fetch.
     */
    where?: ProjectInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectInvoices to fetch.
     */
    orderBy?: ProjectInvoiceOrderByWithRelationInput | ProjectInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectInvoices.
     */
    cursor?: ProjectInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectInvoices.
     */
    skip?: number
    distinct?: ProjectInvoiceScalarFieldEnum | ProjectInvoiceScalarFieldEnum[]
  }

  /**
   * ProjectInvoice create
   */
  export type ProjectInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectInvoice.
     */
    data: XOR<ProjectInvoiceCreateInput, ProjectInvoiceUncheckedCreateInput>
  }

  /**
   * ProjectInvoice createMany
   */
  export type ProjectInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectInvoices.
     */
    data: ProjectInvoiceCreateManyInput | ProjectInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectInvoice createManyAndReturn
   */
  export type ProjectInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectInvoices.
     */
    data: ProjectInvoiceCreateManyInput | ProjectInvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectInvoice update
   */
  export type ProjectInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectInvoice.
     */
    data: XOR<ProjectInvoiceUpdateInput, ProjectInvoiceUncheckedUpdateInput>
    /**
     * Choose, which ProjectInvoice to update.
     */
    where: ProjectInvoiceWhereUniqueInput
  }

  /**
   * ProjectInvoice updateMany
   */
  export type ProjectInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectInvoices.
     */
    data: XOR<ProjectInvoiceUpdateManyMutationInput, ProjectInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which ProjectInvoices to update
     */
    where?: ProjectInvoiceWhereInput
    /**
     * Limit how many ProjectInvoices to update.
     */
    limit?: number
  }

  /**
   * ProjectInvoice updateManyAndReturn
   */
  export type ProjectInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update ProjectInvoices.
     */
    data: XOR<ProjectInvoiceUpdateManyMutationInput, ProjectInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which ProjectInvoices to update
     */
    where?: ProjectInvoiceWhereInput
    /**
     * Limit how many ProjectInvoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectInvoice upsert
   */
  export type ProjectInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectInvoice to update in case it exists.
     */
    where: ProjectInvoiceWhereUniqueInput
    /**
     * In case the ProjectInvoice found by the `where` argument doesn't exist, create a new ProjectInvoice with this data.
     */
    create: XOR<ProjectInvoiceCreateInput, ProjectInvoiceUncheckedCreateInput>
    /**
     * In case the ProjectInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectInvoiceUpdateInput, ProjectInvoiceUncheckedUpdateInput>
  }

  /**
   * ProjectInvoice delete
   */
  export type ProjectInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
    /**
     * Filter which ProjectInvoice to delete.
     */
    where: ProjectInvoiceWhereUniqueInput
  }

  /**
   * ProjectInvoice deleteMany
   */
  export type ProjectInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectInvoices to delete
     */
    where?: ProjectInvoiceWhereInput
    /**
     * Limit how many ProjectInvoices to delete.
     */
    limit?: number
  }

  /**
   * ProjectInvoice without action
   */
  export type ProjectInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectInvoice
     */
    select?: ProjectInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectInvoice
     */
    omit?: ProjectInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model AgentRun
   */

  export type AggregateAgentRun = {
    _count: AgentRunCountAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  export type AgentRunMinAggregateOutputType = {
    id: string | null
    agentName: string | null
    mode: string | null
    startedAt: Date | null
    finishedAt: Date | null
    status: string | null
    error: string | null
  }

  export type AgentRunMaxAggregateOutputType = {
    id: string | null
    agentName: string | null
    mode: string | null
    startedAt: Date | null
    finishedAt: Date | null
    status: string | null
    error: string | null
  }

  export type AgentRunCountAggregateOutputType = {
    id: number
    agentName: number
    mode: number
    startedAt: number
    finishedAt: number
    status: number
    totals: number
    error: number
    _all: number
  }


  export type AgentRunMinAggregateInputType = {
    id?: true
    agentName?: true
    mode?: true
    startedAt?: true
    finishedAt?: true
    status?: true
    error?: true
  }

  export type AgentRunMaxAggregateInputType = {
    id?: true
    agentName?: true
    mode?: true
    startedAt?: true
    finishedAt?: true
    status?: true
    error?: true
  }

  export type AgentRunCountAggregateInputType = {
    id?: true
    agentName?: true
    mode?: true
    startedAt?: true
    finishedAt?: true
    status?: true
    totals?: true
    error?: true
    _all?: true
  }

  export type AgentRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRun to aggregate.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentRuns
    **/
    _count?: true | AgentRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentRunMaxAggregateInputType
  }

  export type GetAgentRunAggregateType<T extends AgentRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentRun[P]>
      : GetScalarType<T[P], AggregateAgentRun[P]>
  }




  export type AgentRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithAggregationInput | AgentRunOrderByWithAggregationInput[]
    by: AgentRunScalarFieldEnum[] | AgentRunScalarFieldEnum
    having?: AgentRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentRunCountAggregateInputType | true
    _min?: AgentRunMinAggregateInputType
    _max?: AgentRunMaxAggregateInputType
  }

  export type AgentRunGroupByOutputType = {
    id: string
    agentName: string
    mode: string | null
    startedAt: Date
    finishedAt: Date | null
    status: string
    totals: JsonValue | null
    error: string | null
    _count: AgentRunCountAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  type GetAgentRunGroupByPayload<T extends AgentRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
            : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
        }
      >
    >


  export type AgentRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    mode?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    status?: boolean
    totals?: boolean
    error?: boolean
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    mode?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    status?: boolean
    totals?: boolean
    error?: boolean
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    mode?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    status?: boolean
    totals?: boolean
    error?: boolean
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectScalar = {
    id?: boolean
    agentName?: boolean
    mode?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    status?: boolean
    totals?: boolean
    error?: boolean
  }

  export type AgentRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentName" | "mode" | "startedAt" | "finishedAt" | "status" | "totals" | "error", ExtArgs["result"]["agentRun"]>

  export type $AgentRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentName: string
      mode: string | null
      startedAt: Date
      finishedAt: Date | null
      status: string
      totals: Prisma.JsonValue | null
      error: string | null
    }, ExtArgs["result"]["agentRun"]>
    composites: {}
  }

  type AgentRunGetPayload<S extends boolean | null | undefined | AgentRunDefaultArgs> = $Result.GetResult<Prisma.$AgentRunPayload, S>

  type AgentRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentRunCountAggregateInputType | true
    }

  export interface AgentRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentRun'], meta: { name: 'AgentRun' } }
    /**
     * Find zero or one AgentRun that matches the filter.
     * @param {AgentRunFindUniqueArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentRunFindUniqueArgs>(args: SelectSubset<T, AgentRunFindUniqueArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentRunFindUniqueOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentRunFindFirstArgs>(args?: SelectSubset<T, AgentRunFindFirstArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentRuns
     * const agentRuns = await prisma.agentRun.findMany()
     * 
     * // Get first 10 AgentRuns
     * const agentRuns = await prisma.agentRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentRunFindManyArgs>(args?: SelectSubset<T, AgentRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentRun.
     * @param {AgentRunCreateArgs} args - Arguments to create a AgentRun.
     * @example
     * // Create one AgentRun
     * const AgentRun = await prisma.agentRun.create({
     *   data: {
     *     // ... data to create a AgentRun
     *   }
     * })
     * 
     */
    create<T extends AgentRunCreateArgs>(args: SelectSubset<T, AgentRunCreateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentRuns.
     * @param {AgentRunCreateManyArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentRunCreateManyArgs>(args?: SelectSubset<T, AgentRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentRuns and returns the data saved in the database.
     * @param {AgentRunCreateManyAndReturnArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentRun.
     * @param {AgentRunDeleteArgs} args - Arguments to delete one AgentRun.
     * @example
     * // Delete one AgentRun
     * const AgentRun = await prisma.agentRun.delete({
     *   where: {
     *     // ... filter to delete one AgentRun
     *   }
     * })
     * 
     */
    delete<T extends AgentRunDeleteArgs>(args: SelectSubset<T, AgentRunDeleteArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentRun.
     * @param {AgentRunUpdateArgs} args - Arguments to update one AgentRun.
     * @example
     * // Update one AgentRun
     * const agentRun = await prisma.agentRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentRunUpdateArgs>(args: SelectSubset<T, AgentRunUpdateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentRuns.
     * @param {AgentRunDeleteManyArgs} args - Arguments to filter AgentRuns to delete.
     * @example
     * // Delete a few AgentRuns
     * const { count } = await prisma.agentRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentRunDeleteManyArgs>(args?: SelectSubset<T, AgentRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentRunUpdateManyArgs>(args: SelectSubset<T, AgentRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns and returns the data updated in the database.
     * @param {AgentRunUpdateManyAndReturnArgs} args - Arguments to update many AgentRuns.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentRunUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentRun.
     * @param {AgentRunUpsertArgs} args - Arguments to update or create a AgentRun.
     * @example
     * // Update or create a AgentRun
     * const agentRun = await prisma.agentRun.upsert({
     *   create: {
     *     // ... data to create a AgentRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentRun we want to update
     *   }
     * })
     */
    upsert<T extends AgentRunUpsertArgs>(args: SelectSubset<T, AgentRunUpsertArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunCountArgs} args - Arguments to filter AgentRuns to count.
     * @example
     * // Count the number of AgentRuns
     * const count = await prisma.agentRun.count({
     *   where: {
     *     // ... the filter for the AgentRuns we want to count
     *   }
     * })
    **/
    count<T extends AgentRunCountArgs>(
      args?: Subset<T, AgentRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentRunAggregateArgs>(args: Subset<T, AgentRunAggregateArgs>): Prisma.PrismaPromise<GetAgentRunAggregateType<T>>

    /**
     * Group by AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentRunGroupByArgs['orderBy'] }
        : { orderBy?: AgentRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentRun model
   */
  readonly fields: AgentRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentRun model
   */
  interface AgentRunFieldRefs {
    readonly id: FieldRef<"AgentRun", 'String'>
    readonly agentName: FieldRef<"AgentRun", 'String'>
    readonly mode: FieldRef<"AgentRun", 'String'>
    readonly startedAt: FieldRef<"AgentRun", 'DateTime'>
    readonly finishedAt: FieldRef<"AgentRun", 'DateTime'>
    readonly status: FieldRef<"AgentRun", 'String'>
    readonly totals: FieldRef<"AgentRun", 'Json'>
    readonly error: FieldRef<"AgentRun", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AgentRun findUnique
   */
  export type AgentRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findUniqueOrThrow
   */
  export type AgentRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findFirst
   */
  export type AgentRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findFirstOrThrow
   */
  export type AgentRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findMany
   */
  export type AgentRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter, which AgentRuns to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun create
   */
  export type AgentRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data needed to create a AgentRun.
     */
    data: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
  }

  /**
   * AgentRun createMany
   */
  export type AgentRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentRun createManyAndReturn
   */
  export type AgentRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentRun update
   */
  export type AgentRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data needed to update a AgentRun.
     */
    data: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
    /**
     * Choose, which AgentRun to update.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun updateMany
   */
  export type AgentRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
  }

  /**
   * AgentRun updateManyAndReturn
   */
  export type AgentRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
  }

  /**
   * AgentRun upsert
   */
  export type AgentRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The filter to search for the AgentRun to update in case it exists.
     */
    where: AgentRunWhereUniqueInput
    /**
     * In case the AgentRun found by the `where` argument doesn't exist, create a new AgentRun with this data.
     */
    create: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
    /**
     * In case the AgentRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
  }

  /**
   * AgentRun delete
   */
  export type AgentRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Filter which AgentRun to delete.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun deleteMany
   */
  export type AgentRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRuns to delete
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to delete.
     */
    limit?: number
  }

  /**
   * AgentRun without action
   */
  export type AgentRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
  }


  /**
   * Model ContactInfo
   */

  export type AggregateContactInfo = {
    _count: ContactInfoCountAggregateOutputType | null
    _avg: ContactInfoAvgAggregateOutputType | null
    _sum: ContactInfoSumAggregateOutputType | null
    _min: ContactInfoMinAggregateOutputType | null
    _max: ContactInfoMaxAggregateOutputType | null
  }

  export type ContactInfoAvgAggregateOutputType = {
    score: number | null
  }

  export type ContactInfoSumAggregateOutputType = {
    score: number | null
  }

  export type ContactInfoMinAggregateOutputType = {
    id: string | null
    artistId: string | null
    email: string | null
    confidence: string | null
    score: number | null
    sourceUrl: string | null
    sourceType: string | null
    discoveredAt: Date | null
  }

  export type ContactInfoMaxAggregateOutputType = {
    id: string | null
    artistId: string | null
    email: string | null
    confidence: string | null
    score: number | null
    sourceUrl: string | null
    sourceType: string | null
    discoveredAt: Date | null
  }

  export type ContactInfoCountAggregateOutputType = {
    id: number
    artistId: number
    email: number
    confidence: number
    score: number
    sourceUrl: number
    sourceType: number
    discoveredAt: number
    _all: number
  }


  export type ContactInfoAvgAggregateInputType = {
    score?: true
  }

  export type ContactInfoSumAggregateInputType = {
    score?: true
  }

  export type ContactInfoMinAggregateInputType = {
    id?: true
    artistId?: true
    email?: true
    confidence?: true
    score?: true
    sourceUrl?: true
    sourceType?: true
    discoveredAt?: true
  }

  export type ContactInfoMaxAggregateInputType = {
    id?: true
    artistId?: true
    email?: true
    confidence?: true
    score?: true
    sourceUrl?: true
    sourceType?: true
    discoveredAt?: true
  }

  export type ContactInfoCountAggregateInputType = {
    id?: true
    artistId?: true
    email?: true
    confidence?: true
    score?: true
    sourceUrl?: true
    sourceType?: true
    discoveredAt?: true
    _all?: true
  }

  export type ContactInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactInfo to aggregate.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactInfos
    **/
    _count?: true | ContactInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContactInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContactInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactInfoMaxAggregateInputType
  }

  export type GetContactInfoAggregateType<T extends ContactInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateContactInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactInfo[P]>
      : GetScalarType<T[P], AggregateContactInfo[P]>
  }




  export type ContactInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactInfoWhereInput
    orderBy?: ContactInfoOrderByWithAggregationInput | ContactInfoOrderByWithAggregationInput[]
    by: ContactInfoScalarFieldEnum[] | ContactInfoScalarFieldEnum
    having?: ContactInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactInfoCountAggregateInputType | true
    _avg?: ContactInfoAvgAggregateInputType
    _sum?: ContactInfoSumAggregateInputType
    _min?: ContactInfoMinAggregateInputType
    _max?: ContactInfoMaxAggregateInputType
  }

  export type ContactInfoGroupByOutputType = {
    id: string
    artistId: string
    email: string
    confidence: string
    score: number
    sourceUrl: string | null
    sourceType: string | null
    discoveredAt: Date
    _count: ContactInfoCountAggregateOutputType | null
    _avg: ContactInfoAvgAggregateOutputType | null
    _sum: ContactInfoSumAggregateOutputType | null
    _min: ContactInfoMinAggregateOutputType | null
    _max: ContactInfoMaxAggregateOutputType | null
  }

  type GetContactInfoGroupByPayload<T extends ContactInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactInfoGroupByOutputType[P]>
            : GetScalarType<T[P], ContactInfoGroupByOutputType[P]>
        }
      >
    >


  export type ContactInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    email?: boolean
    confidence?: boolean
    score?: boolean
    sourceUrl?: boolean
    sourceType?: boolean
    discoveredAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactInfo"]>

  export type ContactInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    email?: boolean
    confidence?: boolean
    score?: boolean
    sourceUrl?: boolean
    sourceType?: boolean
    discoveredAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactInfo"]>

  export type ContactInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    artistId?: boolean
    email?: boolean
    confidence?: boolean
    score?: boolean
    sourceUrl?: boolean
    sourceType?: boolean
    discoveredAt?: boolean
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactInfo"]>

  export type ContactInfoSelectScalar = {
    id?: boolean
    artistId?: boolean
    email?: boolean
    confidence?: boolean
    score?: boolean
    sourceUrl?: boolean
    sourceType?: boolean
    discoveredAt?: boolean
  }

  export type ContactInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "artistId" | "email" | "confidence" | "score" | "sourceUrl" | "sourceType" | "discoveredAt", ExtArgs["result"]["contactInfo"]>
  export type ContactInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type ContactInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type ContactInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    artist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $ContactInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactInfo"
    objects: {
      artist: Prisma.$ArtistPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      artistId: string
      email: string
      confidence: string
      score: number
      sourceUrl: string | null
      sourceType: string | null
      discoveredAt: Date
    }, ExtArgs["result"]["contactInfo"]>
    composites: {}
  }

  type ContactInfoGetPayload<S extends boolean | null | undefined | ContactInfoDefaultArgs> = $Result.GetResult<Prisma.$ContactInfoPayload, S>

  type ContactInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactInfoCountAggregateInputType | true
    }

  export interface ContactInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactInfo'], meta: { name: 'ContactInfo' } }
    /**
     * Find zero or one ContactInfo that matches the filter.
     * @param {ContactInfoFindUniqueArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactInfoFindUniqueArgs>(args: SelectSubset<T, ContactInfoFindUniqueArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactInfoFindUniqueOrThrowArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindFirstArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactInfoFindFirstArgs>(args?: SelectSubset<T, ContactInfoFindFirstArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindFirstOrThrowArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactInfos
     * const contactInfos = await prisma.contactInfo.findMany()
     * 
     * // Get first 10 ContactInfos
     * const contactInfos = await prisma.contactInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactInfoWithIdOnly = await prisma.contactInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactInfoFindManyArgs>(args?: SelectSubset<T, ContactInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactInfo.
     * @param {ContactInfoCreateArgs} args - Arguments to create a ContactInfo.
     * @example
     * // Create one ContactInfo
     * const ContactInfo = await prisma.contactInfo.create({
     *   data: {
     *     // ... data to create a ContactInfo
     *   }
     * })
     * 
     */
    create<T extends ContactInfoCreateArgs>(args: SelectSubset<T, ContactInfoCreateArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactInfos.
     * @param {ContactInfoCreateManyArgs} args - Arguments to create many ContactInfos.
     * @example
     * // Create many ContactInfos
     * const contactInfo = await prisma.contactInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactInfoCreateManyArgs>(args?: SelectSubset<T, ContactInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContactInfos and returns the data saved in the database.
     * @param {ContactInfoCreateManyAndReturnArgs} args - Arguments to create many ContactInfos.
     * @example
     * // Create many ContactInfos
     * const contactInfo = await prisma.contactInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContactInfos and only return the `id`
     * const contactInfoWithIdOnly = await prisma.contactInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContactInfo.
     * @param {ContactInfoDeleteArgs} args - Arguments to delete one ContactInfo.
     * @example
     * // Delete one ContactInfo
     * const ContactInfo = await prisma.contactInfo.delete({
     *   where: {
     *     // ... filter to delete one ContactInfo
     *   }
     * })
     * 
     */
    delete<T extends ContactInfoDeleteArgs>(args: SelectSubset<T, ContactInfoDeleteArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactInfo.
     * @param {ContactInfoUpdateArgs} args - Arguments to update one ContactInfo.
     * @example
     * // Update one ContactInfo
     * const contactInfo = await prisma.contactInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactInfoUpdateArgs>(args: SelectSubset<T, ContactInfoUpdateArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactInfos.
     * @param {ContactInfoDeleteManyArgs} args - Arguments to filter ContactInfos to delete.
     * @example
     * // Delete a few ContactInfos
     * const { count } = await prisma.contactInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactInfoDeleteManyArgs>(args?: SelectSubset<T, ContactInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactInfos
     * const contactInfo = await prisma.contactInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactInfoUpdateManyArgs>(args: SelectSubset<T, ContactInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactInfos and returns the data updated in the database.
     * @param {ContactInfoUpdateManyAndReturnArgs} args - Arguments to update many ContactInfos.
     * @example
     * // Update many ContactInfos
     * const contactInfo = await prisma.contactInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContactInfos and only return the `id`
     * const contactInfoWithIdOnly = await prisma.contactInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContactInfo.
     * @param {ContactInfoUpsertArgs} args - Arguments to update or create a ContactInfo.
     * @example
     * // Update or create a ContactInfo
     * const contactInfo = await prisma.contactInfo.upsert({
     *   create: {
     *     // ... data to create a ContactInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactInfo we want to update
     *   }
     * })
     */
    upsert<T extends ContactInfoUpsertArgs>(args: SelectSubset<T, ContactInfoUpsertArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoCountArgs} args - Arguments to filter ContactInfos to count.
     * @example
     * // Count the number of ContactInfos
     * const count = await prisma.contactInfo.count({
     *   where: {
     *     // ... the filter for the ContactInfos we want to count
     *   }
     * })
    **/
    count<T extends ContactInfoCountArgs>(
      args?: Subset<T, ContactInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactInfoAggregateArgs>(args: Subset<T, ContactInfoAggregateArgs>): Prisma.PrismaPromise<GetContactInfoAggregateType<T>>

    /**
     * Group by ContactInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactInfoGroupByArgs['orderBy'] }
        : { orderBy?: ContactInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactInfo model
   */
  readonly fields: ContactInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    artist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContactInfo model
   */
  interface ContactInfoFieldRefs {
    readonly id: FieldRef<"ContactInfo", 'String'>
    readonly artistId: FieldRef<"ContactInfo", 'String'>
    readonly email: FieldRef<"ContactInfo", 'String'>
    readonly confidence: FieldRef<"ContactInfo", 'String'>
    readonly score: FieldRef<"ContactInfo", 'Int'>
    readonly sourceUrl: FieldRef<"ContactInfo", 'String'>
    readonly sourceType: FieldRef<"ContactInfo", 'String'>
    readonly discoveredAt: FieldRef<"ContactInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactInfo findUnique
   */
  export type ContactInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo findUniqueOrThrow
   */
  export type ContactInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo findFirst
   */
  export type ContactInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactInfos.
     */
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo findFirstOrThrow
   */
  export type ContactInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactInfos.
     */
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo findMany
   */
  export type ContactInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfos to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo create
   */
  export type ContactInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a ContactInfo.
     */
    data: XOR<ContactInfoCreateInput, ContactInfoUncheckedCreateInput>
  }

  /**
   * ContactInfo createMany
   */
  export type ContactInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactInfos.
     */
    data: ContactInfoCreateManyInput | ContactInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactInfo createManyAndReturn
   */
  export type ContactInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * The data used to create many ContactInfos.
     */
    data: ContactInfoCreateManyInput | ContactInfoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContactInfo update
   */
  export type ContactInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a ContactInfo.
     */
    data: XOR<ContactInfoUpdateInput, ContactInfoUncheckedUpdateInput>
    /**
     * Choose, which ContactInfo to update.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo updateMany
   */
  export type ContactInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactInfos.
     */
    data: XOR<ContactInfoUpdateManyMutationInput, ContactInfoUncheckedUpdateManyInput>
    /**
     * Filter which ContactInfos to update
     */
    where?: ContactInfoWhereInput
    /**
     * Limit how many ContactInfos to update.
     */
    limit?: number
  }

  /**
   * ContactInfo updateManyAndReturn
   */
  export type ContactInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * The data used to update ContactInfos.
     */
    data: XOR<ContactInfoUpdateManyMutationInput, ContactInfoUncheckedUpdateManyInput>
    /**
     * Filter which ContactInfos to update
     */
    where?: ContactInfoWhereInput
    /**
     * Limit how many ContactInfos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContactInfo upsert
   */
  export type ContactInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the ContactInfo to update in case it exists.
     */
    where: ContactInfoWhereUniqueInput
    /**
     * In case the ContactInfo found by the `where` argument doesn't exist, create a new ContactInfo with this data.
     */
    create: XOR<ContactInfoCreateInput, ContactInfoUncheckedCreateInput>
    /**
     * In case the ContactInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactInfoUpdateInput, ContactInfoUncheckedUpdateInput>
  }

  /**
   * ContactInfo delete
   */
  export type ContactInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter which ContactInfo to delete.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo deleteMany
   */
  export type ContactInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactInfos to delete
     */
    where?: ContactInfoWhereInput
    /**
     * Limit how many ContactInfos to delete.
     */
    limit?: number
  }

  /**
   * ContactInfo without action
   */
  export type ContactInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
  }


  /**
   * Model MergeProposal
   */

  export type AggregateMergeProposal = {
    _count: MergeProposalCountAggregateOutputType | null
    _avg: MergeProposalAvgAggregateOutputType | null
    _sum: MergeProposalSumAggregateOutputType | null
    _min: MergeProposalMinAggregateOutputType | null
    _max: MergeProposalMaxAggregateOutputType | null
  }

  export type MergeProposalAvgAggregateOutputType = {
    similarityScore: number | null
  }

  export type MergeProposalSumAggregateOutputType = {
    similarityScore: number | null
  }

  export type MergeProposalMinAggregateOutputType = {
    id: string | null
    primaryArtistId: string | null
    duplicateArtistId: string | null
    primaryName: string | null
    duplicateName: string | null
    similarityScore: number | null
    confidence: string | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type MergeProposalMaxAggregateOutputType = {
    id: string | null
    primaryArtistId: string | null
    duplicateArtistId: string | null
    primaryName: string | null
    duplicateName: string | null
    similarityScore: number | null
    confidence: string | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type MergeProposalCountAggregateOutputType = {
    id: number
    primaryArtistId: number
    duplicateArtistId: number
    primaryName: number
    duplicateName: number
    similarityScore: number
    confidence: number
    reason: number
    status: number
    createdAt: number
    _all: number
  }


  export type MergeProposalAvgAggregateInputType = {
    similarityScore?: true
  }

  export type MergeProposalSumAggregateInputType = {
    similarityScore?: true
  }

  export type MergeProposalMinAggregateInputType = {
    id?: true
    primaryArtistId?: true
    duplicateArtistId?: true
    primaryName?: true
    duplicateName?: true
    similarityScore?: true
    confidence?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type MergeProposalMaxAggregateInputType = {
    id?: true
    primaryArtistId?: true
    duplicateArtistId?: true
    primaryName?: true
    duplicateName?: true
    similarityScore?: true
    confidence?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type MergeProposalCountAggregateInputType = {
    id?: true
    primaryArtistId?: true
    duplicateArtistId?: true
    primaryName?: true
    duplicateName?: true
    similarityScore?: true
    confidence?: true
    reason?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type MergeProposalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MergeProposal to aggregate.
     */
    where?: MergeProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MergeProposals to fetch.
     */
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MergeProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MergeProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MergeProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MergeProposals
    **/
    _count?: true | MergeProposalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MergeProposalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MergeProposalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MergeProposalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MergeProposalMaxAggregateInputType
  }

  export type GetMergeProposalAggregateType<T extends MergeProposalAggregateArgs> = {
        [P in keyof T & keyof AggregateMergeProposal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMergeProposal[P]>
      : GetScalarType<T[P], AggregateMergeProposal[P]>
  }




  export type MergeProposalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MergeProposalWhereInput
    orderBy?: MergeProposalOrderByWithAggregationInput | MergeProposalOrderByWithAggregationInput[]
    by: MergeProposalScalarFieldEnum[] | MergeProposalScalarFieldEnum
    having?: MergeProposalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MergeProposalCountAggregateInputType | true
    _avg?: MergeProposalAvgAggregateInputType
    _sum?: MergeProposalSumAggregateInputType
    _min?: MergeProposalMinAggregateInputType
    _max?: MergeProposalMaxAggregateInputType
  }

  export type MergeProposalGroupByOutputType = {
    id: string
    primaryArtistId: string
    duplicateArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status: string
    createdAt: Date
    _count: MergeProposalCountAggregateOutputType | null
    _avg: MergeProposalAvgAggregateOutputType | null
    _sum: MergeProposalSumAggregateOutputType | null
    _min: MergeProposalMinAggregateOutputType | null
    _max: MergeProposalMaxAggregateOutputType | null
  }

  type GetMergeProposalGroupByPayload<T extends MergeProposalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MergeProposalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MergeProposalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MergeProposalGroupByOutputType[P]>
            : GetScalarType<T[P], MergeProposalGroupByOutputType[P]>
        }
      >
    >


  export type MergeProposalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    primaryArtistId?: boolean
    duplicateArtistId?: boolean
    primaryName?: boolean
    duplicateName?: boolean
    similarityScore?: boolean
    confidence?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mergeProposal"]>

  export type MergeProposalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    primaryArtistId?: boolean
    duplicateArtistId?: boolean
    primaryName?: boolean
    duplicateName?: boolean
    similarityScore?: boolean
    confidence?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mergeProposal"]>

  export type MergeProposalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    primaryArtistId?: boolean
    duplicateArtistId?: boolean
    primaryName?: boolean
    duplicateName?: boolean
    similarityScore?: boolean
    confidence?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mergeProposal"]>

  export type MergeProposalSelectScalar = {
    id?: boolean
    primaryArtistId?: boolean
    duplicateArtistId?: boolean
    primaryName?: boolean
    duplicateName?: boolean
    similarityScore?: boolean
    confidence?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type MergeProposalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "primaryArtistId" | "duplicateArtistId" | "primaryName" | "duplicateName" | "similarityScore" | "confidence" | "reason" | "status" | "createdAt", ExtArgs["result"]["mergeProposal"]>
  export type MergeProposalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type MergeProposalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }
  export type MergeProposalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryArtist?: boolean | ArtistDefaultArgs<ExtArgs>
    duplicateArtist?: boolean | ArtistDefaultArgs<ExtArgs>
  }

  export type $MergeProposalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MergeProposal"
    objects: {
      primaryArtist: Prisma.$ArtistPayload<ExtArgs>
      duplicateArtist: Prisma.$ArtistPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      primaryArtistId: string
      duplicateArtistId: string
      primaryName: string
      duplicateName: string
      similarityScore: number
      confidence: string
      reason: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["mergeProposal"]>
    composites: {}
  }

  type MergeProposalGetPayload<S extends boolean | null | undefined | MergeProposalDefaultArgs> = $Result.GetResult<Prisma.$MergeProposalPayload, S>

  type MergeProposalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MergeProposalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MergeProposalCountAggregateInputType | true
    }

  export interface MergeProposalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MergeProposal'], meta: { name: 'MergeProposal' } }
    /**
     * Find zero or one MergeProposal that matches the filter.
     * @param {MergeProposalFindUniqueArgs} args - Arguments to find a MergeProposal
     * @example
     * // Get one MergeProposal
     * const mergeProposal = await prisma.mergeProposal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MergeProposalFindUniqueArgs>(args: SelectSubset<T, MergeProposalFindUniqueArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MergeProposal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MergeProposalFindUniqueOrThrowArgs} args - Arguments to find a MergeProposal
     * @example
     * // Get one MergeProposal
     * const mergeProposal = await prisma.mergeProposal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MergeProposalFindUniqueOrThrowArgs>(args: SelectSubset<T, MergeProposalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MergeProposal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalFindFirstArgs} args - Arguments to find a MergeProposal
     * @example
     * // Get one MergeProposal
     * const mergeProposal = await prisma.mergeProposal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MergeProposalFindFirstArgs>(args?: SelectSubset<T, MergeProposalFindFirstArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MergeProposal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalFindFirstOrThrowArgs} args - Arguments to find a MergeProposal
     * @example
     * // Get one MergeProposal
     * const mergeProposal = await prisma.mergeProposal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MergeProposalFindFirstOrThrowArgs>(args?: SelectSubset<T, MergeProposalFindFirstOrThrowArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MergeProposals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MergeProposals
     * const mergeProposals = await prisma.mergeProposal.findMany()
     * 
     * // Get first 10 MergeProposals
     * const mergeProposals = await prisma.mergeProposal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mergeProposalWithIdOnly = await prisma.mergeProposal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MergeProposalFindManyArgs>(args?: SelectSubset<T, MergeProposalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MergeProposal.
     * @param {MergeProposalCreateArgs} args - Arguments to create a MergeProposal.
     * @example
     * // Create one MergeProposal
     * const MergeProposal = await prisma.mergeProposal.create({
     *   data: {
     *     // ... data to create a MergeProposal
     *   }
     * })
     * 
     */
    create<T extends MergeProposalCreateArgs>(args: SelectSubset<T, MergeProposalCreateArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MergeProposals.
     * @param {MergeProposalCreateManyArgs} args - Arguments to create many MergeProposals.
     * @example
     * // Create many MergeProposals
     * const mergeProposal = await prisma.mergeProposal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MergeProposalCreateManyArgs>(args?: SelectSubset<T, MergeProposalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MergeProposals and returns the data saved in the database.
     * @param {MergeProposalCreateManyAndReturnArgs} args - Arguments to create many MergeProposals.
     * @example
     * // Create many MergeProposals
     * const mergeProposal = await prisma.mergeProposal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MergeProposals and only return the `id`
     * const mergeProposalWithIdOnly = await prisma.mergeProposal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MergeProposalCreateManyAndReturnArgs>(args?: SelectSubset<T, MergeProposalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MergeProposal.
     * @param {MergeProposalDeleteArgs} args - Arguments to delete one MergeProposal.
     * @example
     * // Delete one MergeProposal
     * const MergeProposal = await prisma.mergeProposal.delete({
     *   where: {
     *     // ... filter to delete one MergeProposal
     *   }
     * })
     * 
     */
    delete<T extends MergeProposalDeleteArgs>(args: SelectSubset<T, MergeProposalDeleteArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MergeProposal.
     * @param {MergeProposalUpdateArgs} args - Arguments to update one MergeProposal.
     * @example
     * // Update one MergeProposal
     * const mergeProposal = await prisma.mergeProposal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MergeProposalUpdateArgs>(args: SelectSubset<T, MergeProposalUpdateArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MergeProposals.
     * @param {MergeProposalDeleteManyArgs} args - Arguments to filter MergeProposals to delete.
     * @example
     * // Delete a few MergeProposals
     * const { count } = await prisma.mergeProposal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MergeProposalDeleteManyArgs>(args?: SelectSubset<T, MergeProposalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MergeProposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MergeProposals
     * const mergeProposal = await prisma.mergeProposal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MergeProposalUpdateManyArgs>(args: SelectSubset<T, MergeProposalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MergeProposals and returns the data updated in the database.
     * @param {MergeProposalUpdateManyAndReturnArgs} args - Arguments to update many MergeProposals.
     * @example
     * // Update many MergeProposals
     * const mergeProposal = await prisma.mergeProposal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MergeProposals and only return the `id`
     * const mergeProposalWithIdOnly = await prisma.mergeProposal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MergeProposalUpdateManyAndReturnArgs>(args: SelectSubset<T, MergeProposalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MergeProposal.
     * @param {MergeProposalUpsertArgs} args - Arguments to update or create a MergeProposal.
     * @example
     * // Update or create a MergeProposal
     * const mergeProposal = await prisma.mergeProposal.upsert({
     *   create: {
     *     // ... data to create a MergeProposal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MergeProposal we want to update
     *   }
     * })
     */
    upsert<T extends MergeProposalUpsertArgs>(args: SelectSubset<T, MergeProposalUpsertArgs<ExtArgs>>): Prisma__MergeProposalClient<$Result.GetResult<Prisma.$MergeProposalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MergeProposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalCountArgs} args - Arguments to filter MergeProposals to count.
     * @example
     * // Count the number of MergeProposals
     * const count = await prisma.mergeProposal.count({
     *   where: {
     *     // ... the filter for the MergeProposals we want to count
     *   }
     * })
    **/
    count<T extends MergeProposalCountArgs>(
      args?: Subset<T, MergeProposalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MergeProposalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MergeProposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MergeProposalAggregateArgs>(args: Subset<T, MergeProposalAggregateArgs>): Prisma.PrismaPromise<GetMergeProposalAggregateType<T>>

    /**
     * Group by MergeProposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MergeProposalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MergeProposalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MergeProposalGroupByArgs['orderBy'] }
        : { orderBy?: MergeProposalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MergeProposalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMergeProposalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MergeProposal model
   */
  readonly fields: MergeProposalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MergeProposal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MergeProposalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    primaryArtist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    duplicateArtist<T extends ArtistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArtistDefaultArgs<ExtArgs>>): Prisma__ArtistClient<$Result.GetResult<Prisma.$ArtistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MergeProposal model
   */
  interface MergeProposalFieldRefs {
    readonly id: FieldRef<"MergeProposal", 'String'>
    readonly primaryArtistId: FieldRef<"MergeProposal", 'String'>
    readonly duplicateArtistId: FieldRef<"MergeProposal", 'String'>
    readonly primaryName: FieldRef<"MergeProposal", 'String'>
    readonly duplicateName: FieldRef<"MergeProposal", 'String'>
    readonly similarityScore: FieldRef<"MergeProposal", 'Float'>
    readonly confidence: FieldRef<"MergeProposal", 'String'>
    readonly reason: FieldRef<"MergeProposal", 'String'>
    readonly status: FieldRef<"MergeProposal", 'String'>
    readonly createdAt: FieldRef<"MergeProposal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MergeProposal findUnique
   */
  export type MergeProposalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter, which MergeProposal to fetch.
     */
    where: MergeProposalWhereUniqueInput
  }

  /**
   * MergeProposal findUniqueOrThrow
   */
  export type MergeProposalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter, which MergeProposal to fetch.
     */
    where: MergeProposalWhereUniqueInput
  }

  /**
   * MergeProposal findFirst
   */
  export type MergeProposalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter, which MergeProposal to fetch.
     */
    where?: MergeProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MergeProposals to fetch.
     */
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MergeProposals.
     */
    cursor?: MergeProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MergeProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MergeProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MergeProposals.
     */
    distinct?: MergeProposalScalarFieldEnum | MergeProposalScalarFieldEnum[]
  }

  /**
   * MergeProposal findFirstOrThrow
   */
  export type MergeProposalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter, which MergeProposal to fetch.
     */
    where?: MergeProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MergeProposals to fetch.
     */
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MergeProposals.
     */
    cursor?: MergeProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MergeProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MergeProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MergeProposals.
     */
    distinct?: MergeProposalScalarFieldEnum | MergeProposalScalarFieldEnum[]
  }

  /**
   * MergeProposal findMany
   */
  export type MergeProposalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter, which MergeProposals to fetch.
     */
    where?: MergeProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MergeProposals to fetch.
     */
    orderBy?: MergeProposalOrderByWithRelationInput | MergeProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MergeProposals.
     */
    cursor?: MergeProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MergeProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MergeProposals.
     */
    skip?: number
    distinct?: MergeProposalScalarFieldEnum | MergeProposalScalarFieldEnum[]
  }

  /**
   * MergeProposal create
   */
  export type MergeProposalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * The data needed to create a MergeProposal.
     */
    data: XOR<MergeProposalCreateInput, MergeProposalUncheckedCreateInput>
  }

  /**
   * MergeProposal createMany
   */
  export type MergeProposalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MergeProposals.
     */
    data: MergeProposalCreateManyInput | MergeProposalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MergeProposal createManyAndReturn
   */
  export type MergeProposalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * The data used to create many MergeProposals.
     */
    data: MergeProposalCreateManyInput | MergeProposalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MergeProposal update
   */
  export type MergeProposalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * The data needed to update a MergeProposal.
     */
    data: XOR<MergeProposalUpdateInput, MergeProposalUncheckedUpdateInput>
    /**
     * Choose, which MergeProposal to update.
     */
    where: MergeProposalWhereUniqueInput
  }

  /**
   * MergeProposal updateMany
   */
  export type MergeProposalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MergeProposals.
     */
    data: XOR<MergeProposalUpdateManyMutationInput, MergeProposalUncheckedUpdateManyInput>
    /**
     * Filter which MergeProposals to update
     */
    where?: MergeProposalWhereInput
    /**
     * Limit how many MergeProposals to update.
     */
    limit?: number
  }

  /**
   * MergeProposal updateManyAndReturn
   */
  export type MergeProposalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * The data used to update MergeProposals.
     */
    data: XOR<MergeProposalUpdateManyMutationInput, MergeProposalUncheckedUpdateManyInput>
    /**
     * Filter which MergeProposals to update
     */
    where?: MergeProposalWhereInput
    /**
     * Limit how many MergeProposals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MergeProposal upsert
   */
  export type MergeProposalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * The filter to search for the MergeProposal to update in case it exists.
     */
    where: MergeProposalWhereUniqueInput
    /**
     * In case the MergeProposal found by the `where` argument doesn't exist, create a new MergeProposal with this data.
     */
    create: XOR<MergeProposalCreateInput, MergeProposalUncheckedCreateInput>
    /**
     * In case the MergeProposal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MergeProposalUpdateInput, MergeProposalUncheckedUpdateInput>
  }

  /**
   * MergeProposal delete
   */
  export type MergeProposalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
    /**
     * Filter which MergeProposal to delete.
     */
    where: MergeProposalWhereUniqueInput
  }

  /**
   * MergeProposal deleteMany
   */
  export type MergeProposalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MergeProposals to delete
     */
    where?: MergeProposalWhereInput
    /**
     * Limit how many MergeProposals to delete.
     */
    limit?: number
  }

  /**
   * MergeProposal without action
   */
  export type MergeProposalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MergeProposal
     */
    select?: MergeProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MergeProposal
     */
    omit?: MergeProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MergeProposalInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ArtistScalarFieldEnum: {
    id: 'id',
    name: 'name',
    instagramHandle: 'instagramHandle',
    instagramProfileUrl: 'instagramProfileUrl',
    instagramProfileImageUrl: 'instagramProfileImageUrl',
    spotifyArtistId: 'spotifyArtistId',
    spotifyArtistUrl: 'spotifyArtistUrl',
    spotifyImageUrl: 'spotifyImageUrl',
    spotifyAccent: 'spotifyAccent',
    spotifyAccentStrong: 'spotifyAccentStrong',
    spotifyHighlight: 'spotifyHighlight',
    officialSiteUrl: 'officialSiteUrl',
    location: 'location',
    city: 'city',
    state: 'state',
    country: 'country',
    genre: 'genre',
    tags: 'tags',
    bio: 'bio',
    emails: 'emails',
    followerCount: 'followerCount',
    lastPostAt: 'lastPostAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArtistScalarFieldEnum = (typeof ArtistScalarFieldEnum)[keyof typeof ArtistScalarFieldEnum]


  export const LeadScalarFieldEnum: {
    id: 'id',
    artistId: 'artistId',
    status: 'status',
    score: 'score',
    scoreRationale: 'scoreRationale',
    lastContactedAt: 'lastContactedAt',
    nextActionAt: 'nextActionAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum]


  export const ReleaseScalarFieldEnum: {
    id: 'id',
    artistId: 'artistId',
    spotifyTrackId: 'spotifyTrackId',
    spotifyReleaseId: 'spotifyReleaseId',
    title: 'title',
    releaseDate: 'releaseDate',
    imageUrl: 'imageUrl',
    url: 'url',
    releaseType: 'releaseType',
    createdAt: 'createdAt'
  };

  export type ReleaseScalarFieldEnum = (typeof ReleaseScalarFieldEnum)[keyof typeof ReleaseScalarFieldEnum]


  export const InstagramPostScalarFieldEnum: {
    id: 'id',
    artistId: 'artistId',
    instagramPostId: 'instagramPostId',
    caption: 'caption',
    imageUrl: 'imageUrl',
    postedAt: 'postedAt',
    url: 'url',
    createdAt: 'createdAt'
  };

  export type InstagramPostScalarFieldEnum = (typeof InstagramPostScalarFieldEnum)[keyof typeof InstagramPostScalarFieldEnum]


  export const MessageDraftScalarFieldEnum: {
    id: 'id',
    leadId: 'leadId',
    tone: 'tone',
    body: 'body',
    source: 'source',
    selected: 'selected',
    createdAt: 'createdAt'
  };

  export type MessageDraftScalarFieldEnum = (typeof MessageDraftScalarFieldEnum)[keyof typeof MessageDraftScalarFieldEnum]


  export const ActivityScalarFieldEnum: {
    id: 'id',
    leadId: 'leadId',
    type: 'type',
    note: 'note',
    occurredAt: 'occurredAt',
    createdAt: 'createdAt'
  };

  export type ActivityScalarFieldEnum = (typeof ActivityScalarFieldEnum)[keyof typeof ActivityScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    artistId: 'artistId',
    title: 'title',
    portalToken: 'portalToken',
    status: 'status',
    rating: 'rating',
    review: 'review',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    url: 'url',
    key: 'key',
    size: 'size',
    mimeType: 'mimeType',
    type: 'type',
    isPublic: 'isPublic',
    createdAt: 'createdAt'
  };

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const ProjectFeedbackScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    content: 'content',
    resolved: 'resolved',
    createdAt: 'createdAt',
    fileId: 'fileId',
    timestamp: 'timestamp'
  };

  export type ProjectFeedbackScalarFieldEnum = (typeof ProjectFeedbackScalarFieldEnum)[keyof typeof ProjectFeedbackScalarFieldEnum]


  export const ProjectInvoiceScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    invoiceNumber: 'invoiceNumber',
    issuedAt: 'issuedAt',
    dueAt: 'dueAt',
    currency: 'currency',
    lineItems: 'lineItems',
    subtotalCents: 'subtotalCents',
    taxCents: 'taxCents',
    totalCents: 'totalCents',
    notes: 'notes',
    stripePaymentUrl: 'stripePaymentUrl',
    paidAt: 'paidAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectInvoiceScalarFieldEnum = (typeof ProjectInvoiceScalarFieldEnum)[keyof typeof ProjectInvoiceScalarFieldEnum]


  export const AgentRunScalarFieldEnum: {
    id: 'id',
    agentName: 'agentName',
    mode: 'mode',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    status: 'status',
    totals: 'totals',
    error: 'error'
  };

  export type AgentRunScalarFieldEnum = (typeof AgentRunScalarFieldEnum)[keyof typeof AgentRunScalarFieldEnum]


  export const ContactInfoScalarFieldEnum: {
    id: 'id',
    artistId: 'artistId',
    email: 'email',
    confidence: 'confidence',
    score: 'score',
    sourceUrl: 'sourceUrl',
    sourceType: 'sourceType',
    discoveredAt: 'discoveredAt'
  };

  export type ContactInfoScalarFieldEnum = (typeof ContactInfoScalarFieldEnum)[keyof typeof ContactInfoScalarFieldEnum]


  export const MergeProposalScalarFieldEnum: {
    id: 'id',
    primaryArtistId: 'primaryArtistId',
    duplicateArtistId: 'duplicateArtistId',
    primaryName: 'primaryName',
    duplicateName: 'duplicateName',
    similarityScore: 'similarityScore',
    confidence: 'confidence',
    reason: 'reason',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type MergeProposalScalarFieldEnum = (typeof MergeProposalScalarFieldEnum)[keyof typeof MergeProposalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'LeadStatus'
   */
  export type EnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus'>
    


  /**
   * Reference to a field of type 'LeadStatus[]'
   */
  export type ListEnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ActivityType'
   */
  export type EnumActivityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityType'>
    


  /**
   * Reference to a field of type 'ActivityType[]'
   */
  export type ListEnumActivityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityType[]'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ProjectStatus[]'
   */
  export type ListEnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus[]'>
    


  /**
   * Reference to a field of type 'FileType'
   */
  export type EnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType'>
    


  /**
   * Reference to a field of type 'FileType[]'
   */
  export type ListEnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type ArtistWhereInput = {
    AND?: ArtistWhereInput | ArtistWhereInput[]
    OR?: ArtistWhereInput[]
    NOT?: ArtistWhereInput | ArtistWhereInput[]
    id?: StringFilter<"Artist"> | string
    name?: StringFilter<"Artist"> | string
    instagramHandle?: StringNullableFilter<"Artist"> | string | null
    instagramProfileUrl?: StringNullableFilter<"Artist"> | string | null
    instagramProfileImageUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyArtistId?: StringNullableFilter<"Artist"> | string | null
    spotifyArtistUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyImageUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyAccent?: StringNullableFilter<"Artist"> | string | null
    spotifyAccentStrong?: StringNullableFilter<"Artist"> | string | null
    spotifyHighlight?: StringNullableFilter<"Artist"> | string | null
    officialSiteUrl?: StringNullableFilter<"Artist"> | string | null
    location?: StringNullableFilter<"Artist"> | string | null
    city?: StringNullableFilter<"Artist"> | string | null
    state?: StringNullableFilter<"Artist"> | string | null
    country?: StringNullableFilter<"Artist"> | string | null
    genre?: StringNullableFilter<"Artist"> | string | null
    tags?: StringNullableListFilter<"Artist">
    bio?: StringNullableFilter<"Artist"> | string | null
    emails?: StringNullableListFilter<"Artist">
    followerCount?: IntNullableFilter<"Artist"> | number | null
    lastPostAt?: DateTimeNullableFilter<"Artist"> | Date | string | null
    createdAt?: DateTimeFilter<"Artist"> | Date | string
    updatedAt?: DateTimeFilter<"Artist"> | Date | string
    leads?: LeadListRelationFilter
    releases?: ReleaseListRelationFilter
    instagramPosts?: InstagramPostListRelationFilter
    projects?: ProjectListRelationFilter
    contactInfos?: ContactInfoListRelationFilter
    primaryMerges?: MergeProposalListRelationFilter
    duplicateMerges?: MergeProposalListRelationFilter
  }

  export type ArtistOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    instagramHandle?: SortOrderInput | SortOrder
    instagramProfileUrl?: SortOrderInput | SortOrder
    instagramProfileImageUrl?: SortOrderInput | SortOrder
    spotifyArtistId?: SortOrderInput | SortOrder
    spotifyArtistUrl?: SortOrderInput | SortOrder
    spotifyImageUrl?: SortOrderInput | SortOrder
    spotifyAccent?: SortOrderInput | SortOrder
    spotifyAccentStrong?: SortOrderInput | SortOrder
    spotifyHighlight?: SortOrderInput | SortOrder
    officialSiteUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    genre?: SortOrderInput | SortOrder
    tags?: SortOrder
    bio?: SortOrderInput | SortOrder
    emails?: SortOrder
    followerCount?: SortOrderInput | SortOrder
    lastPostAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    leads?: LeadOrderByRelationAggregateInput
    releases?: ReleaseOrderByRelationAggregateInput
    instagramPosts?: InstagramPostOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    contactInfos?: ContactInfoOrderByRelationAggregateInput
    primaryMerges?: MergeProposalOrderByRelationAggregateInput
    duplicateMerges?: MergeProposalOrderByRelationAggregateInput
  }

  export type ArtistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    instagramHandle?: string
    spotifyArtistId?: string
    AND?: ArtistWhereInput | ArtistWhereInput[]
    OR?: ArtistWhereInput[]
    NOT?: ArtistWhereInput | ArtistWhereInput[]
    name?: StringFilter<"Artist"> | string
    instagramProfileUrl?: StringNullableFilter<"Artist"> | string | null
    instagramProfileImageUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyArtistUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyImageUrl?: StringNullableFilter<"Artist"> | string | null
    spotifyAccent?: StringNullableFilter<"Artist"> | string | null
    spotifyAccentStrong?: StringNullableFilter<"Artist"> | string | null
    spotifyHighlight?: StringNullableFilter<"Artist"> | string | null
    officialSiteUrl?: StringNullableFilter<"Artist"> | string | null
    location?: StringNullableFilter<"Artist"> | string | null
    city?: StringNullableFilter<"Artist"> | string | null
    state?: StringNullableFilter<"Artist"> | string | null
    country?: StringNullableFilter<"Artist"> | string | null
    genre?: StringNullableFilter<"Artist"> | string | null
    tags?: StringNullableListFilter<"Artist">
    bio?: StringNullableFilter<"Artist"> | string | null
    emails?: StringNullableListFilter<"Artist">
    followerCount?: IntNullableFilter<"Artist"> | number | null
    lastPostAt?: DateTimeNullableFilter<"Artist"> | Date | string | null
    createdAt?: DateTimeFilter<"Artist"> | Date | string
    updatedAt?: DateTimeFilter<"Artist"> | Date | string
    leads?: LeadListRelationFilter
    releases?: ReleaseListRelationFilter
    instagramPosts?: InstagramPostListRelationFilter
    projects?: ProjectListRelationFilter
    contactInfos?: ContactInfoListRelationFilter
    primaryMerges?: MergeProposalListRelationFilter
    duplicateMerges?: MergeProposalListRelationFilter
  }, "id" | "instagramHandle" | "spotifyArtistId">

  export type ArtistOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    instagramHandle?: SortOrderInput | SortOrder
    instagramProfileUrl?: SortOrderInput | SortOrder
    instagramProfileImageUrl?: SortOrderInput | SortOrder
    spotifyArtistId?: SortOrderInput | SortOrder
    spotifyArtistUrl?: SortOrderInput | SortOrder
    spotifyImageUrl?: SortOrderInput | SortOrder
    spotifyAccent?: SortOrderInput | SortOrder
    spotifyAccentStrong?: SortOrderInput | SortOrder
    spotifyHighlight?: SortOrderInput | SortOrder
    officialSiteUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    genre?: SortOrderInput | SortOrder
    tags?: SortOrder
    bio?: SortOrderInput | SortOrder
    emails?: SortOrder
    followerCount?: SortOrderInput | SortOrder
    lastPostAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArtistCountOrderByAggregateInput
    _avg?: ArtistAvgOrderByAggregateInput
    _max?: ArtistMaxOrderByAggregateInput
    _min?: ArtistMinOrderByAggregateInput
    _sum?: ArtistSumOrderByAggregateInput
  }

  export type ArtistScalarWhereWithAggregatesInput = {
    AND?: ArtistScalarWhereWithAggregatesInput | ArtistScalarWhereWithAggregatesInput[]
    OR?: ArtistScalarWhereWithAggregatesInput[]
    NOT?: ArtistScalarWhereWithAggregatesInput | ArtistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Artist"> | string
    name?: StringWithAggregatesFilter<"Artist"> | string
    instagramHandle?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    instagramProfileUrl?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    instagramProfileImageUrl?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyArtistId?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyArtistUrl?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyImageUrl?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyAccent?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyAccentStrong?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    spotifyHighlight?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    officialSiteUrl?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    location?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    city?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    state?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    country?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    genre?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    tags?: StringNullableListFilter<"Artist">
    bio?: StringNullableWithAggregatesFilter<"Artist"> | string | null
    emails?: StringNullableListFilter<"Artist">
    followerCount?: IntNullableWithAggregatesFilter<"Artist"> | number | null
    lastPostAt?: DateTimeNullableWithAggregatesFilter<"Artist"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Artist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Artist"> | Date | string
  }

  export type LeadWhereInput = {
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    id?: StringFilter<"Lead"> | string
    artistId?: StringFilter<"Lead"> | string
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    score?: FloatNullableFilter<"Lead"> | number | null
    scoreRationale?: StringNullableFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    nextActionAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    messages?: MessageDraftListRelationFilter
    activities?: ActivityListRelationFilter
  }

  export type LeadOrderByWithRelationInput = {
    id?: SortOrder
    artistId?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    scoreRationale?: SortOrderInput | SortOrder
    lastContactedAt?: SortOrderInput | SortOrder
    nextActionAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    artist?: ArtistOrderByWithRelationInput
    messages?: MessageDraftOrderByRelationAggregateInput
    activities?: ActivityOrderByRelationAggregateInput
  }

  export type LeadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    artistId?: StringFilter<"Lead"> | string
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    score?: FloatNullableFilter<"Lead"> | number | null
    scoreRationale?: StringNullableFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    nextActionAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    messages?: MessageDraftListRelationFilter
    activities?: ActivityListRelationFilter
  }, "id">

  export type LeadOrderByWithAggregationInput = {
    id?: SortOrder
    artistId?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    scoreRationale?: SortOrderInput | SortOrder
    lastContactedAt?: SortOrderInput | SortOrder
    nextActionAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeadCountOrderByAggregateInput
    _avg?: LeadAvgOrderByAggregateInput
    _max?: LeadMaxOrderByAggregateInput
    _min?: LeadMinOrderByAggregateInput
    _sum?: LeadSumOrderByAggregateInput
  }

  export type LeadScalarWhereWithAggregatesInput = {
    AND?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    OR?: LeadScalarWhereWithAggregatesInput[]
    NOT?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lead"> | string
    artistId?: StringWithAggregatesFilter<"Lead"> | string
    status?: EnumLeadStatusWithAggregatesFilter<"Lead"> | $Enums.LeadStatus
    score?: FloatNullableWithAggregatesFilter<"Lead"> | number | null
    scoreRationale?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    nextActionAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
  }

  export type ReleaseWhereInput = {
    AND?: ReleaseWhereInput | ReleaseWhereInput[]
    OR?: ReleaseWhereInput[]
    NOT?: ReleaseWhereInput | ReleaseWhereInput[]
    id?: StringFilter<"Release"> | string
    artistId?: StringFilter<"Release"> | string
    spotifyTrackId?: StringNullableFilter<"Release"> | string | null
    spotifyReleaseId?: StringNullableFilter<"Release"> | string | null
    title?: StringFilter<"Release"> | string
    releaseDate?: DateTimeNullableFilter<"Release"> | Date | string | null
    imageUrl?: StringNullableFilter<"Release"> | string | null
    url?: StringNullableFilter<"Release"> | string | null
    releaseType?: StringNullableFilter<"Release"> | string | null
    createdAt?: DateTimeFilter<"Release"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }

  export type ReleaseOrderByWithRelationInput = {
    id?: SortOrder
    artistId?: SortOrder
    spotifyTrackId?: SortOrderInput | SortOrder
    spotifyReleaseId?: SortOrderInput | SortOrder
    title?: SortOrder
    releaseDate?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    releaseType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    artist?: ArtistOrderByWithRelationInput
  }

  export type ReleaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    spotifyTrackId?: string
    spotifyReleaseId?: string
    AND?: ReleaseWhereInput | ReleaseWhereInput[]
    OR?: ReleaseWhereInput[]
    NOT?: ReleaseWhereInput | ReleaseWhereInput[]
    artistId?: StringFilter<"Release"> | string
    title?: StringFilter<"Release"> | string
    releaseDate?: DateTimeNullableFilter<"Release"> | Date | string | null
    imageUrl?: StringNullableFilter<"Release"> | string | null
    url?: StringNullableFilter<"Release"> | string | null
    releaseType?: StringNullableFilter<"Release"> | string | null
    createdAt?: DateTimeFilter<"Release"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }, "id" | "spotifyTrackId" | "spotifyReleaseId">

  export type ReleaseOrderByWithAggregationInput = {
    id?: SortOrder
    artistId?: SortOrder
    spotifyTrackId?: SortOrderInput | SortOrder
    spotifyReleaseId?: SortOrderInput | SortOrder
    title?: SortOrder
    releaseDate?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    releaseType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ReleaseCountOrderByAggregateInput
    _max?: ReleaseMaxOrderByAggregateInput
    _min?: ReleaseMinOrderByAggregateInput
  }

  export type ReleaseScalarWhereWithAggregatesInput = {
    AND?: ReleaseScalarWhereWithAggregatesInput | ReleaseScalarWhereWithAggregatesInput[]
    OR?: ReleaseScalarWhereWithAggregatesInput[]
    NOT?: ReleaseScalarWhereWithAggregatesInput | ReleaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Release"> | string
    artistId?: StringWithAggregatesFilter<"Release"> | string
    spotifyTrackId?: StringNullableWithAggregatesFilter<"Release"> | string | null
    spotifyReleaseId?: StringNullableWithAggregatesFilter<"Release"> | string | null
    title?: StringWithAggregatesFilter<"Release"> | string
    releaseDate?: DateTimeNullableWithAggregatesFilter<"Release"> | Date | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Release"> | string | null
    url?: StringNullableWithAggregatesFilter<"Release"> | string | null
    releaseType?: StringNullableWithAggregatesFilter<"Release"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Release"> | Date | string
  }

  export type InstagramPostWhereInput = {
    AND?: InstagramPostWhereInput | InstagramPostWhereInput[]
    OR?: InstagramPostWhereInput[]
    NOT?: InstagramPostWhereInput | InstagramPostWhereInput[]
    id?: StringFilter<"InstagramPost"> | string
    artistId?: StringFilter<"InstagramPost"> | string
    instagramPostId?: StringNullableFilter<"InstagramPost"> | string | null
    caption?: StringNullableFilter<"InstagramPost"> | string | null
    imageUrl?: StringNullableFilter<"InstagramPost"> | string | null
    postedAt?: DateTimeNullableFilter<"InstagramPost"> | Date | string | null
    url?: StringNullableFilter<"InstagramPost"> | string | null
    createdAt?: DateTimeFilter<"InstagramPost"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }

  export type InstagramPostOrderByWithRelationInput = {
    id?: SortOrder
    artistId?: SortOrder
    instagramPostId?: SortOrderInput | SortOrder
    caption?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    postedAt?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    artist?: ArtistOrderByWithRelationInput
  }

  export type InstagramPostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    instagramPostId?: string
    AND?: InstagramPostWhereInput | InstagramPostWhereInput[]
    OR?: InstagramPostWhereInput[]
    NOT?: InstagramPostWhereInput | InstagramPostWhereInput[]
    artistId?: StringFilter<"InstagramPost"> | string
    caption?: StringNullableFilter<"InstagramPost"> | string | null
    imageUrl?: StringNullableFilter<"InstagramPost"> | string | null
    postedAt?: DateTimeNullableFilter<"InstagramPost"> | Date | string | null
    url?: StringNullableFilter<"InstagramPost"> | string | null
    createdAt?: DateTimeFilter<"InstagramPost"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }, "id" | "instagramPostId">

  export type InstagramPostOrderByWithAggregationInput = {
    id?: SortOrder
    artistId?: SortOrder
    instagramPostId?: SortOrderInput | SortOrder
    caption?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    postedAt?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InstagramPostCountOrderByAggregateInput
    _max?: InstagramPostMaxOrderByAggregateInput
    _min?: InstagramPostMinOrderByAggregateInput
  }

  export type InstagramPostScalarWhereWithAggregatesInput = {
    AND?: InstagramPostScalarWhereWithAggregatesInput | InstagramPostScalarWhereWithAggregatesInput[]
    OR?: InstagramPostScalarWhereWithAggregatesInput[]
    NOT?: InstagramPostScalarWhereWithAggregatesInput | InstagramPostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InstagramPost"> | string
    artistId?: StringWithAggregatesFilter<"InstagramPost"> | string
    instagramPostId?: StringNullableWithAggregatesFilter<"InstagramPost"> | string | null
    caption?: StringNullableWithAggregatesFilter<"InstagramPost"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"InstagramPost"> | string | null
    postedAt?: DateTimeNullableWithAggregatesFilter<"InstagramPost"> | Date | string | null
    url?: StringNullableWithAggregatesFilter<"InstagramPost"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InstagramPost"> | Date | string
  }

  export type MessageDraftWhereInput = {
    AND?: MessageDraftWhereInput | MessageDraftWhereInput[]
    OR?: MessageDraftWhereInput[]
    NOT?: MessageDraftWhereInput | MessageDraftWhereInput[]
    id?: StringFilter<"MessageDraft"> | string
    leadId?: StringFilter<"MessageDraft"> | string
    tone?: StringNullableFilter<"MessageDraft"> | string | null
    body?: StringFilter<"MessageDraft"> | string
    source?: StringNullableFilter<"MessageDraft"> | string | null
    selected?: BoolFilter<"MessageDraft"> | boolean
    createdAt?: DateTimeFilter<"MessageDraft"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }

  export type MessageDraftOrderByWithRelationInput = {
    id?: SortOrder
    leadId?: SortOrder
    tone?: SortOrderInput | SortOrder
    body?: SortOrder
    source?: SortOrderInput | SortOrder
    selected?: SortOrder
    createdAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
  }

  export type MessageDraftWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageDraftWhereInput | MessageDraftWhereInput[]
    OR?: MessageDraftWhereInput[]
    NOT?: MessageDraftWhereInput | MessageDraftWhereInput[]
    leadId?: StringFilter<"MessageDraft"> | string
    tone?: StringNullableFilter<"MessageDraft"> | string | null
    body?: StringFilter<"MessageDraft"> | string
    source?: StringNullableFilter<"MessageDraft"> | string | null
    selected?: BoolFilter<"MessageDraft"> | boolean
    createdAt?: DateTimeFilter<"MessageDraft"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }, "id">

  export type MessageDraftOrderByWithAggregationInput = {
    id?: SortOrder
    leadId?: SortOrder
    tone?: SortOrderInput | SortOrder
    body?: SortOrder
    source?: SortOrderInput | SortOrder
    selected?: SortOrder
    createdAt?: SortOrder
    _count?: MessageDraftCountOrderByAggregateInput
    _max?: MessageDraftMaxOrderByAggregateInput
    _min?: MessageDraftMinOrderByAggregateInput
  }

  export type MessageDraftScalarWhereWithAggregatesInput = {
    AND?: MessageDraftScalarWhereWithAggregatesInput | MessageDraftScalarWhereWithAggregatesInput[]
    OR?: MessageDraftScalarWhereWithAggregatesInput[]
    NOT?: MessageDraftScalarWhereWithAggregatesInput | MessageDraftScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MessageDraft"> | string
    leadId?: StringWithAggregatesFilter<"MessageDraft"> | string
    tone?: StringNullableWithAggregatesFilter<"MessageDraft"> | string | null
    body?: StringWithAggregatesFilter<"MessageDraft"> | string
    source?: StringNullableWithAggregatesFilter<"MessageDraft"> | string | null
    selected?: BoolWithAggregatesFilter<"MessageDraft"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"MessageDraft"> | Date | string
  }

  export type ActivityWhereInput = {
    AND?: ActivityWhereInput | ActivityWhereInput[]
    OR?: ActivityWhereInput[]
    NOT?: ActivityWhereInput | ActivityWhereInput[]
    id?: StringFilter<"Activity"> | string
    leadId?: StringFilter<"Activity"> | string
    type?: EnumActivityTypeFilter<"Activity"> | $Enums.ActivityType
    note?: StringNullableFilter<"Activity"> | string | null
    occurredAt?: DateTimeFilter<"Activity"> | Date | string
    createdAt?: DateTimeFilter<"Activity"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }

  export type ActivityOrderByWithRelationInput = {
    id?: SortOrder
    leadId?: SortOrder
    type?: SortOrder
    note?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    createdAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
  }

  export type ActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActivityWhereInput | ActivityWhereInput[]
    OR?: ActivityWhereInput[]
    NOT?: ActivityWhereInput | ActivityWhereInput[]
    leadId?: StringFilter<"Activity"> | string
    type?: EnumActivityTypeFilter<"Activity"> | $Enums.ActivityType
    note?: StringNullableFilter<"Activity"> | string | null
    occurredAt?: DateTimeFilter<"Activity"> | Date | string
    createdAt?: DateTimeFilter<"Activity"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }, "id">

  export type ActivityOrderByWithAggregationInput = {
    id?: SortOrder
    leadId?: SortOrder
    type?: SortOrder
    note?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    createdAt?: SortOrder
    _count?: ActivityCountOrderByAggregateInput
    _max?: ActivityMaxOrderByAggregateInput
    _min?: ActivityMinOrderByAggregateInput
  }

  export type ActivityScalarWhereWithAggregatesInput = {
    AND?: ActivityScalarWhereWithAggregatesInput | ActivityScalarWhereWithAggregatesInput[]
    OR?: ActivityScalarWhereWithAggregatesInput[]
    NOT?: ActivityScalarWhereWithAggregatesInput | ActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Activity"> | string
    leadId?: StringWithAggregatesFilter<"Activity"> | string
    type?: EnumActivityTypeWithAggregatesFilter<"Activity"> | $Enums.ActivityType
    note?: StringNullableWithAggregatesFilter<"Activity"> | string | null
    occurredAt?: DateTimeWithAggregatesFilter<"Activity"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Activity"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    artistId?: StringFilter<"Project"> | string
    title?: StringNullableFilter<"Project"> | string | null
    portalToken?: StringFilter<"Project"> | string
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    rating?: IntNullableFilter<"Project"> | number | null
    review?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    files?: ProjectFileListRelationFilter
    feedbacks?: ProjectFeedbackListRelationFilter
    invoice?: XOR<ProjectInvoiceNullableScalarRelationFilter, ProjectInvoiceWhereInput> | null
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    artistId?: SortOrder
    title?: SortOrderInput | SortOrder
    portalToken?: SortOrder
    status?: SortOrder
    rating?: SortOrderInput | SortOrder
    review?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    artist?: ArtistOrderByWithRelationInput
    files?: ProjectFileOrderByRelationAggregateInput
    feedbacks?: ProjectFeedbackOrderByRelationAggregateInput
    invoice?: ProjectInvoiceOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    portalToken?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    artistId?: StringFilter<"Project"> | string
    title?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    rating?: IntNullableFilter<"Project"> | number | null
    review?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    files?: ProjectFileListRelationFilter
    feedbacks?: ProjectFeedbackListRelationFilter
    invoice?: XOR<ProjectInvoiceNullableScalarRelationFilter, ProjectInvoiceWhereInput> | null
  }, "id" | "portalToken">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    artistId?: SortOrder
    title?: SortOrderInput | SortOrder
    portalToken?: SortOrder
    status?: SortOrder
    rating?: SortOrderInput | SortOrder
    review?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    artistId?: StringWithAggregatesFilter<"Project"> | string
    title?: StringNullableWithAggregatesFilter<"Project"> | string | null
    portalToken?: StringWithAggregatesFilter<"Project"> | string
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    rating?: IntNullableWithAggregatesFilter<"Project"> | number | null
    review?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    url?: StringFilter<"ProjectFile"> | string
    key?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    isPublic?: BoolFilter<"ProjectFile"> | boolean
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    feedbacks?: ProjectFeedbackListRelationFilter
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    key?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    type?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    feedbacks?: ProjectFeedbackOrderByRelationAggregateInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    projectId?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    url?: StringFilter<"ProjectFile"> | string
    key?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    isPublic?: BoolFilter<"ProjectFile"> | boolean
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    feedbacks?: ProjectFeedbackListRelationFilter
  }, "id">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    key?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    type?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _avg?: ProjectFileAvgOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
    _sum?: ProjectFileSumOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    projectId?: StringWithAggregatesFilter<"ProjectFile"> | string
    name?: StringWithAggregatesFilter<"ProjectFile"> | string
    url?: StringWithAggregatesFilter<"ProjectFile"> | string
    key?: StringWithAggregatesFilter<"ProjectFile"> | string
    size?: IntWithAggregatesFilter<"ProjectFile"> | number
    mimeType?: StringWithAggregatesFilter<"ProjectFile"> | string
    type?: EnumFileTypeWithAggregatesFilter<"ProjectFile"> | $Enums.FileType
    isPublic?: BoolWithAggregatesFilter<"ProjectFile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
  }

  export type ProjectFeedbackWhereInput = {
    AND?: ProjectFeedbackWhereInput | ProjectFeedbackWhereInput[]
    OR?: ProjectFeedbackWhereInput[]
    NOT?: ProjectFeedbackWhereInput | ProjectFeedbackWhereInput[]
    id?: StringFilter<"ProjectFeedback"> | string
    projectId?: StringFilter<"ProjectFeedback"> | string
    content?: StringFilter<"ProjectFeedback"> | string
    resolved?: BoolFilter<"ProjectFeedback"> | boolean
    createdAt?: DateTimeFilter<"ProjectFeedback"> | Date | string
    fileId?: StringNullableFilter<"ProjectFeedback"> | string | null
    timestamp?: FloatNullableFilter<"ProjectFeedback"> | number | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    file?: XOR<ProjectFileNullableScalarRelationFilter, ProjectFileWhereInput> | null
  }

  export type ProjectFeedbackOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    resolved?: SortOrder
    createdAt?: SortOrder
    fileId?: SortOrderInput | SortOrder
    timestamp?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    file?: ProjectFileOrderByWithRelationInput
  }

  export type ProjectFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectFeedbackWhereInput | ProjectFeedbackWhereInput[]
    OR?: ProjectFeedbackWhereInput[]
    NOT?: ProjectFeedbackWhereInput | ProjectFeedbackWhereInput[]
    projectId?: StringFilter<"ProjectFeedback"> | string
    content?: StringFilter<"ProjectFeedback"> | string
    resolved?: BoolFilter<"ProjectFeedback"> | boolean
    createdAt?: DateTimeFilter<"ProjectFeedback"> | Date | string
    fileId?: StringNullableFilter<"ProjectFeedback"> | string | null
    timestamp?: FloatNullableFilter<"ProjectFeedback"> | number | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    file?: XOR<ProjectFileNullableScalarRelationFilter, ProjectFileWhereInput> | null
  }, "id">

  export type ProjectFeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    resolved?: SortOrder
    createdAt?: SortOrder
    fileId?: SortOrderInput | SortOrder
    timestamp?: SortOrderInput | SortOrder
    _count?: ProjectFeedbackCountOrderByAggregateInput
    _avg?: ProjectFeedbackAvgOrderByAggregateInput
    _max?: ProjectFeedbackMaxOrderByAggregateInput
    _min?: ProjectFeedbackMinOrderByAggregateInput
    _sum?: ProjectFeedbackSumOrderByAggregateInput
  }

  export type ProjectFeedbackScalarWhereWithAggregatesInput = {
    AND?: ProjectFeedbackScalarWhereWithAggregatesInput | ProjectFeedbackScalarWhereWithAggregatesInput[]
    OR?: ProjectFeedbackScalarWhereWithAggregatesInput[]
    NOT?: ProjectFeedbackScalarWhereWithAggregatesInput | ProjectFeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFeedback"> | string
    projectId?: StringWithAggregatesFilter<"ProjectFeedback"> | string
    content?: StringWithAggregatesFilter<"ProjectFeedback"> | string
    resolved?: BoolWithAggregatesFilter<"ProjectFeedback"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ProjectFeedback"> | Date | string
    fileId?: StringNullableWithAggregatesFilter<"ProjectFeedback"> | string | null
    timestamp?: FloatNullableWithAggregatesFilter<"ProjectFeedback"> | number | null
  }

  export type ProjectInvoiceWhereInput = {
    AND?: ProjectInvoiceWhereInput | ProjectInvoiceWhereInput[]
    OR?: ProjectInvoiceWhereInput[]
    NOT?: ProjectInvoiceWhereInput | ProjectInvoiceWhereInput[]
    id?: StringFilter<"ProjectInvoice"> | string
    projectId?: StringFilter<"ProjectInvoice"> | string
    invoiceNumber?: StringFilter<"ProjectInvoice"> | string
    issuedAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    dueAt?: DateTimeNullableFilter<"ProjectInvoice"> | Date | string | null
    currency?: StringFilter<"ProjectInvoice"> | string
    lineItems?: JsonFilter<"ProjectInvoice">
    subtotalCents?: IntFilter<"ProjectInvoice"> | number
    taxCents?: IntFilter<"ProjectInvoice"> | number
    totalCents?: IntFilter<"ProjectInvoice"> | number
    notes?: StringNullableFilter<"ProjectInvoice"> | string | null
    stripePaymentUrl?: StringNullableFilter<"ProjectInvoice"> | string | null
    paidAt?: DateTimeNullableFilter<"ProjectInvoice"> | Date | string | null
    createdAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    invoiceNumber?: SortOrder
    issuedAt?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
    notes?: SortOrderInput | SortOrder
    stripePaymentUrl?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId?: string
    AND?: ProjectInvoiceWhereInput | ProjectInvoiceWhereInput[]
    OR?: ProjectInvoiceWhereInput[]
    NOT?: ProjectInvoiceWhereInput | ProjectInvoiceWhereInput[]
    invoiceNumber?: StringFilter<"ProjectInvoice"> | string
    issuedAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    dueAt?: DateTimeNullableFilter<"ProjectInvoice"> | Date | string | null
    currency?: StringFilter<"ProjectInvoice"> | string
    lineItems?: JsonFilter<"ProjectInvoice">
    subtotalCents?: IntFilter<"ProjectInvoice"> | number
    taxCents?: IntFilter<"ProjectInvoice"> | number
    totalCents?: IntFilter<"ProjectInvoice"> | number
    notes?: StringNullableFilter<"ProjectInvoice"> | string | null
    stripePaymentUrl?: StringNullableFilter<"ProjectInvoice"> | string | null
    paidAt?: DateTimeNullableFilter<"ProjectInvoice"> | Date | string | null
    createdAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectInvoice"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "projectId">

  export type ProjectInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    invoiceNumber?: SortOrder
    issuedAt?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
    notes?: SortOrderInput | SortOrder
    stripePaymentUrl?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectInvoiceCountOrderByAggregateInput
    _avg?: ProjectInvoiceAvgOrderByAggregateInput
    _max?: ProjectInvoiceMaxOrderByAggregateInput
    _min?: ProjectInvoiceMinOrderByAggregateInput
    _sum?: ProjectInvoiceSumOrderByAggregateInput
  }

  export type ProjectInvoiceScalarWhereWithAggregatesInput = {
    AND?: ProjectInvoiceScalarWhereWithAggregatesInput | ProjectInvoiceScalarWhereWithAggregatesInput[]
    OR?: ProjectInvoiceScalarWhereWithAggregatesInput[]
    NOT?: ProjectInvoiceScalarWhereWithAggregatesInput | ProjectInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectInvoice"> | string
    projectId?: StringWithAggregatesFilter<"ProjectInvoice"> | string
    invoiceNumber?: StringWithAggregatesFilter<"ProjectInvoice"> | string
    issuedAt?: DateTimeWithAggregatesFilter<"ProjectInvoice"> | Date | string
    dueAt?: DateTimeNullableWithAggregatesFilter<"ProjectInvoice"> | Date | string | null
    currency?: StringWithAggregatesFilter<"ProjectInvoice"> | string
    lineItems?: JsonWithAggregatesFilter<"ProjectInvoice">
    subtotalCents?: IntWithAggregatesFilter<"ProjectInvoice"> | number
    taxCents?: IntWithAggregatesFilter<"ProjectInvoice"> | number
    totalCents?: IntWithAggregatesFilter<"ProjectInvoice"> | number
    notes?: StringNullableWithAggregatesFilter<"ProjectInvoice"> | string | null
    stripePaymentUrl?: StringNullableWithAggregatesFilter<"ProjectInvoice"> | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"ProjectInvoice"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProjectInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProjectInvoice"> | Date | string
  }

  export type AgentRunWhereInput = {
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    agentName?: StringFilter<"AgentRun"> | string
    mode?: StringNullableFilter<"AgentRun"> | string | null
    startedAt?: DateTimeFilter<"AgentRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"AgentRun"> | Date | string | null
    status?: StringFilter<"AgentRun"> | string
    totals?: JsonNullableFilter<"AgentRun">
    error?: StringNullableFilter<"AgentRun"> | string | null
  }

  export type AgentRunOrderByWithRelationInput = {
    id?: SortOrder
    agentName?: SortOrder
    mode?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    totals?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
  }

  export type AgentRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    agentName?: StringFilter<"AgentRun"> | string
    mode?: StringNullableFilter<"AgentRun"> | string | null
    startedAt?: DateTimeFilter<"AgentRun"> | Date | string
    finishedAt?: DateTimeNullableFilter<"AgentRun"> | Date | string | null
    status?: StringFilter<"AgentRun"> | string
    totals?: JsonNullableFilter<"AgentRun">
    error?: StringNullableFilter<"AgentRun"> | string | null
  }, "id">

  export type AgentRunOrderByWithAggregationInput = {
    id?: SortOrder
    agentName?: SortOrder
    mode?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    totals?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    _count?: AgentRunCountOrderByAggregateInput
    _max?: AgentRunMaxOrderByAggregateInput
    _min?: AgentRunMinOrderByAggregateInput
  }

  export type AgentRunScalarWhereWithAggregatesInput = {
    AND?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    OR?: AgentRunScalarWhereWithAggregatesInput[]
    NOT?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentRun"> | string
    agentName?: StringWithAggregatesFilter<"AgentRun"> | string
    mode?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"AgentRun"> | Date | string
    finishedAt?: DateTimeNullableWithAggregatesFilter<"AgentRun"> | Date | string | null
    status?: StringWithAggregatesFilter<"AgentRun"> | string
    totals?: JsonNullableWithAggregatesFilter<"AgentRun">
    error?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
  }

  export type ContactInfoWhereInput = {
    AND?: ContactInfoWhereInput | ContactInfoWhereInput[]
    OR?: ContactInfoWhereInput[]
    NOT?: ContactInfoWhereInput | ContactInfoWhereInput[]
    id?: StringFilter<"ContactInfo"> | string
    artistId?: StringFilter<"ContactInfo"> | string
    email?: StringFilter<"ContactInfo"> | string
    confidence?: StringFilter<"ContactInfo"> | string
    score?: IntFilter<"ContactInfo"> | number
    sourceUrl?: StringNullableFilter<"ContactInfo"> | string | null
    sourceType?: StringNullableFilter<"ContactInfo"> | string | null
    discoveredAt?: DateTimeFilter<"ContactInfo"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }

  export type ContactInfoOrderByWithRelationInput = {
    id?: SortOrder
    artistId?: SortOrder
    email?: SortOrder
    confidence?: SortOrder
    score?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    sourceType?: SortOrderInput | SortOrder
    discoveredAt?: SortOrder
    artist?: ArtistOrderByWithRelationInput
  }

  export type ContactInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    artistId_email?: ContactInfoArtistIdEmailCompoundUniqueInput
    AND?: ContactInfoWhereInput | ContactInfoWhereInput[]
    OR?: ContactInfoWhereInput[]
    NOT?: ContactInfoWhereInput | ContactInfoWhereInput[]
    artistId?: StringFilter<"ContactInfo"> | string
    email?: StringFilter<"ContactInfo"> | string
    confidence?: StringFilter<"ContactInfo"> | string
    score?: IntFilter<"ContactInfo"> | number
    sourceUrl?: StringNullableFilter<"ContactInfo"> | string | null
    sourceType?: StringNullableFilter<"ContactInfo"> | string | null
    discoveredAt?: DateTimeFilter<"ContactInfo"> | Date | string
    artist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }, "id" | "artistId_email">

  export type ContactInfoOrderByWithAggregationInput = {
    id?: SortOrder
    artistId?: SortOrder
    email?: SortOrder
    confidence?: SortOrder
    score?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    sourceType?: SortOrderInput | SortOrder
    discoveredAt?: SortOrder
    _count?: ContactInfoCountOrderByAggregateInput
    _avg?: ContactInfoAvgOrderByAggregateInput
    _max?: ContactInfoMaxOrderByAggregateInput
    _min?: ContactInfoMinOrderByAggregateInput
    _sum?: ContactInfoSumOrderByAggregateInput
  }

  export type ContactInfoScalarWhereWithAggregatesInput = {
    AND?: ContactInfoScalarWhereWithAggregatesInput | ContactInfoScalarWhereWithAggregatesInput[]
    OR?: ContactInfoScalarWhereWithAggregatesInput[]
    NOT?: ContactInfoScalarWhereWithAggregatesInput | ContactInfoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactInfo"> | string
    artistId?: StringWithAggregatesFilter<"ContactInfo"> | string
    email?: StringWithAggregatesFilter<"ContactInfo"> | string
    confidence?: StringWithAggregatesFilter<"ContactInfo"> | string
    score?: IntWithAggregatesFilter<"ContactInfo"> | number
    sourceUrl?: StringNullableWithAggregatesFilter<"ContactInfo"> | string | null
    sourceType?: StringNullableWithAggregatesFilter<"ContactInfo"> | string | null
    discoveredAt?: DateTimeWithAggregatesFilter<"ContactInfo"> | Date | string
  }

  export type MergeProposalWhereInput = {
    AND?: MergeProposalWhereInput | MergeProposalWhereInput[]
    OR?: MergeProposalWhereInput[]
    NOT?: MergeProposalWhereInput | MergeProposalWhereInput[]
    id?: StringFilter<"MergeProposal"> | string
    primaryArtistId?: StringFilter<"MergeProposal"> | string
    duplicateArtistId?: StringFilter<"MergeProposal"> | string
    primaryName?: StringFilter<"MergeProposal"> | string
    duplicateName?: StringFilter<"MergeProposal"> | string
    similarityScore?: FloatFilter<"MergeProposal"> | number
    confidence?: StringFilter<"MergeProposal"> | string
    reason?: StringFilter<"MergeProposal"> | string
    status?: StringFilter<"MergeProposal"> | string
    createdAt?: DateTimeFilter<"MergeProposal"> | Date | string
    primaryArtist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    duplicateArtist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }

  export type MergeProposalOrderByWithRelationInput = {
    id?: SortOrder
    primaryArtistId?: SortOrder
    duplicateArtistId?: SortOrder
    primaryName?: SortOrder
    duplicateName?: SortOrder
    similarityScore?: SortOrder
    confidence?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    primaryArtist?: ArtistOrderByWithRelationInput
    duplicateArtist?: ArtistOrderByWithRelationInput
  }

  export type MergeProposalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    duplicateArtistId?: string
    AND?: MergeProposalWhereInput | MergeProposalWhereInput[]
    OR?: MergeProposalWhereInput[]
    NOT?: MergeProposalWhereInput | MergeProposalWhereInput[]
    primaryArtistId?: StringFilter<"MergeProposal"> | string
    primaryName?: StringFilter<"MergeProposal"> | string
    duplicateName?: StringFilter<"MergeProposal"> | string
    similarityScore?: FloatFilter<"MergeProposal"> | number
    confidence?: StringFilter<"MergeProposal"> | string
    reason?: StringFilter<"MergeProposal"> | string
    status?: StringFilter<"MergeProposal"> | string
    createdAt?: DateTimeFilter<"MergeProposal"> | Date | string
    primaryArtist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
    duplicateArtist?: XOR<ArtistScalarRelationFilter, ArtistWhereInput>
  }, "id" | "duplicateArtistId">

  export type MergeProposalOrderByWithAggregationInput = {
    id?: SortOrder
    primaryArtistId?: SortOrder
    duplicateArtistId?: SortOrder
    primaryName?: SortOrder
    duplicateName?: SortOrder
    similarityScore?: SortOrder
    confidence?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: MergeProposalCountOrderByAggregateInput
    _avg?: MergeProposalAvgOrderByAggregateInput
    _max?: MergeProposalMaxOrderByAggregateInput
    _min?: MergeProposalMinOrderByAggregateInput
    _sum?: MergeProposalSumOrderByAggregateInput
  }

  export type MergeProposalScalarWhereWithAggregatesInput = {
    AND?: MergeProposalScalarWhereWithAggregatesInput | MergeProposalScalarWhereWithAggregatesInput[]
    OR?: MergeProposalScalarWhereWithAggregatesInput[]
    NOT?: MergeProposalScalarWhereWithAggregatesInput | MergeProposalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MergeProposal"> | string
    primaryArtistId?: StringWithAggregatesFilter<"MergeProposal"> | string
    duplicateArtistId?: StringWithAggregatesFilter<"MergeProposal"> | string
    primaryName?: StringWithAggregatesFilter<"MergeProposal"> | string
    duplicateName?: StringWithAggregatesFilter<"MergeProposal"> | string
    similarityScore?: FloatWithAggregatesFilter<"MergeProposal"> | number
    confidence?: StringWithAggregatesFilter<"MergeProposal"> | string
    reason?: StringWithAggregatesFilter<"MergeProposal"> | string
    status?: StringWithAggregatesFilter<"MergeProposal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MergeProposal"> | Date | string
  }

  export type ArtistCreateInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistCreateManyInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutLeadsInput
    messages?: MessageDraftCreateNestedManyWithoutLeadInput
    activities?: ActivityCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateInput = {
    id?: string
    artistId: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageDraftUncheckedCreateNestedManyWithoutLeadInput
    activities?: ActivityUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutLeadsNestedInput
    messages?: MessageDraftUpdateManyWithoutLeadNestedInput
    activities?: ActivityUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageDraftUncheckedUpdateManyWithoutLeadNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateManyInput = {
    id?: string
    artistId: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseCreateInput = {
    id?: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
    artist: ArtistCreateNestedOneWithoutReleasesInput
  }

  export type ReleaseUncheckedCreateInput = {
    id?: string
    artistId: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
  }

  export type ReleaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutReleasesNestedInput
  }

  export type ReleaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseCreateManyInput = {
    id?: string
    artistId: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
  }

  export type ReleaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostCreateInput = {
    id?: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
    artist: ArtistCreateNestedOneWithoutInstagramPostsInput
  }

  export type InstagramPostUncheckedCreateInput = {
    id?: string
    artistId: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
  }

  export type InstagramPostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutInstagramPostsNestedInput
  }

  export type InstagramPostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostCreateManyInput = {
    id?: string
    artistId: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
  }

  export type InstagramPostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftCreateInput = {
    id?: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
    lead: LeadCreateNestedOneWithoutMessagesInput
  }

  export type MessageDraftUncheckedCreateInput = {
    id?: string
    leadId: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
  }

  export type MessageDraftUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageDraftUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftCreateManyInput = {
    id?: string
    leadId: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
  }

  export type MessageDraftUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityCreateInput = {
    id?: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
    lead: LeadCreateNestedOneWithoutActivitiesInput
  }

  export type ActivityUncheckedCreateInput = {
    id?: string
    leadId: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
  }

  export type ActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type ActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityCreateManyInput = {
    id?: string
    leadId: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
  }

  export type ActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    artistId: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    artistId: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateInput = {
    id?: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    feedbacks?: ProjectFeedbackUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    projectId: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFeedbackCreateInput = {
    id?: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    timestamp?: number | null
    project: ProjectCreateNestedOneWithoutFeedbacksInput
    file?: ProjectFileCreateNestedOneWithoutFeedbacksInput
  }

  export type ProjectFeedbackUncheckedCreateInput = {
    id?: string
    projectId: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    fileId?: string | null
    timestamp?: number | null
  }

  export type ProjectFeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    project?: ProjectUpdateOneRequiredWithoutFeedbacksNestedInput
    file?: ProjectFileUpdateOneWithoutFeedbacksNestedInput
  }

  export type ProjectFeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectFeedbackCreateManyInput = {
    id?: string
    projectId: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    fileId?: string | null
    timestamp?: number | null
  }

  export type ProjectFeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectFeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectInvoiceCreateInput = {
    id?: string
    invoiceNumber: string
    issuedAt?: Date | string
    dueAt?: Date | string | null
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    subtotalCents: number
    taxCents?: number
    totalCents: number
    notes?: string | null
    stripePaymentUrl?: string | null
    paidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutInvoiceInput
  }

  export type ProjectInvoiceUncheckedCreateInput = {
    id?: string
    projectId: string
    invoiceNumber: string
    issuedAt?: Date | string
    dueAt?: Date | string | null
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    subtotalCents: number
    taxCents?: number
    totalCents: number
    notes?: string | null
    stripePaymentUrl?: string | null
    paidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutInvoiceNestedInput
  }

  export type ProjectInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectInvoiceCreateManyInput = {
    id?: string
    projectId: string
    invoiceNumber: string
    issuedAt?: Date | string
    dueAt?: Date | string | null
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    subtotalCents: number
    taxCents?: number
    totalCents: number
    notes?: string | null
    stripePaymentUrl?: string | null
    paidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateInput = {
    id?: string
    agentName: string
    mode?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
    status: string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
  }

  export type AgentRunUncheckedCreateInput = {
    id?: string
    agentName: string
    mode?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
    status: string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
  }

  export type AgentRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    mode?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgentRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    mode?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgentRunCreateManyInput = {
    id?: string
    agentName: string
    mode?: string | null
    startedAt?: Date | string
    finishedAt?: Date | string | null
    status: string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
  }

  export type AgentRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    mode?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgentRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    mode?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    totals?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ContactInfoCreateInput = {
    id?: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
    artist: ArtistCreateNestedOneWithoutContactInfosInput
  }

  export type ContactInfoUncheckedCreateInput = {
    id?: string
    artistId: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
  }

  export type ContactInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutContactInfosNestedInput
  }

  export type ContactInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoCreateManyInput = {
    id?: string
    artistId: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
  }

  export type ContactInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalCreateInput = {
    id?: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
    primaryArtist: ArtistCreateNestedOneWithoutPrimaryMergesInput
    duplicateArtist: ArtistCreateNestedOneWithoutDuplicateMergesInput
  }

  export type MergeProposalUncheckedCreateInput = {
    id?: string
    primaryArtistId: string
    duplicateArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type MergeProposalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryArtist?: ArtistUpdateOneRequiredWithoutPrimaryMergesNestedInput
    duplicateArtist?: ArtistUpdateOneRequiredWithoutDuplicateMergesNestedInput
  }

  export type MergeProposalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryArtistId?: StringFieldUpdateOperationsInput | string
    duplicateArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalCreateManyInput = {
    id?: string
    primaryArtistId: string
    duplicateArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type MergeProposalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryArtistId?: StringFieldUpdateOperationsInput | string
    duplicateArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LeadListRelationFilter = {
    every?: LeadWhereInput
    some?: LeadWhereInput
    none?: LeadWhereInput
  }

  export type ReleaseListRelationFilter = {
    every?: ReleaseWhereInput
    some?: ReleaseWhereInput
    none?: ReleaseWhereInput
  }

  export type InstagramPostListRelationFilter = {
    every?: InstagramPostWhereInput
    some?: InstagramPostWhereInput
    none?: InstagramPostWhereInput
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ContactInfoListRelationFilter = {
    every?: ContactInfoWhereInput
    some?: ContactInfoWhereInput
    none?: ContactInfoWhereInput
  }

  export type MergeProposalListRelationFilter = {
    every?: MergeProposalWhereInput
    some?: MergeProposalWhereInput
    none?: MergeProposalWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LeadOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReleaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstagramPostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactInfoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MergeProposalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArtistCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    instagramHandle?: SortOrder
    instagramProfileUrl?: SortOrder
    instagramProfileImageUrl?: SortOrder
    spotifyArtistId?: SortOrder
    spotifyArtistUrl?: SortOrder
    spotifyImageUrl?: SortOrder
    spotifyAccent?: SortOrder
    spotifyAccentStrong?: SortOrder
    spotifyHighlight?: SortOrder
    officialSiteUrl?: SortOrder
    location?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    genre?: SortOrder
    tags?: SortOrder
    bio?: SortOrder
    emails?: SortOrder
    followerCount?: SortOrder
    lastPostAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistAvgOrderByAggregateInput = {
    followerCount?: SortOrder
  }

  export type ArtistMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    instagramHandle?: SortOrder
    instagramProfileUrl?: SortOrder
    instagramProfileImageUrl?: SortOrder
    spotifyArtistId?: SortOrder
    spotifyArtistUrl?: SortOrder
    spotifyImageUrl?: SortOrder
    spotifyAccent?: SortOrder
    spotifyAccentStrong?: SortOrder
    spotifyHighlight?: SortOrder
    officialSiteUrl?: SortOrder
    location?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    genre?: SortOrder
    bio?: SortOrder
    followerCount?: SortOrder
    lastPostAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    instagramHandle?: SortOrder
    instagramProfileUrl?: SortOrder
    instagramProfileImageUrl?: SortOrder
    spotifyArtistId?: SortOrder
    spotifyArtistUrl?: SortOrder
    spotifyImageUrl?: SortOrder
    spotifyAccent?: SortOrder
    spotifyAccentStrong?: SortOrder
    spotifyHighlight?: SortOrder
    officialSiteUrl?: SortOrder
    location?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    genre?: SortOrder
    bio?: SortOrder
    followerCount?: SortOrder
    lastPostAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistSumOrderByAggregateInput = {
    followerCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ArtistScalarRelationFilter = {
    is?: ArtistWhereInput
    isNot?: ArtistWhereInput
  }

  export type MessageDraftListRelationFilter = {
    every?: MessageDraftWhereInput
    some?: MessageDraftWhereInput
    none?: MessageDraftWhereInput
  }

  export type ActivityListRelationFilter = {
    every?: ActivityWhereInput
    some?: ActivityWhereInput
    none?: ActivityWhereInput
  }

  export type MessageDraftOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeadCountOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    scoreRationale?: SortOrder
    lastContactedAt?: SortOrder
    nextActionAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type LeadMaxOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    scoreRationale?: SortOrder
    lastContactedAt?: SortOrder
    nextActionAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadMinOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    scoreRationale?: SortOrder
    lastContactedAt?: SortOrder
    nextActionAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ReleaseCountOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    spotifyTrackId?: SortOrder
    spotifyReleaseId?: SortOrder
    title?: SortOrder
    releaseDate?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    releaseType?: SortOrder
    createdAt?: SortOrder
  }

  export type ReleaseMaxOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    spotifyTrackId?: SortOrder
    spotifyReleaseId?: SortOrder
    title?: SortOrder
    releaseDate?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    releaseType?: SortOrder
    createdAt?: SortOrder
  }

  export type ReleaseMinOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    spotifyTrackId?: SortOrder
    spotifyReleaseId?: SortOrder
    title?: SortOrder
    releaseDate?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    releaseType?: SortOrder
    createdAt?: SortOrder
  }

  export type InstagramPostCountOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    instagramPostId?: SortOrder
    caption?: SortOrder
    imageUrl?: SortOrder
    postedAt?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type InstagramPostMaxOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    instagramPostId?: SortOrder
    caption?: SortOrder
    imageUrl?: SortOrder
    postedAt?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type InstagramPostMinOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    instagramPostId?: SortOrder
    caption?: SortOrder
    imageUrl?: SortOrder
    postedAt?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LeadScalarRelationFilter = {
    is?: LeadWhereInput
    isNot?: LeadWhereInput
  }

  export type MessageDraftCountOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    tone?: SortOrder
    body?: SortOrder
    source?: SortOrder
    selected?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageDraftMaxOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    tone?: SortOrder
    body?: SortOrder
    source?: SortOrder
    selected?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageDraftMinOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    tone?: SortOrder
    body?: SortOrder
    source?: SortOrder
    selected?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumActivityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityType | EnumActivityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActivityTypeFilter<$PrismaModel> | $Enums.ActivityType
  }

  export type ActivityCountOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    type?: SortOrder
    note?: SortOrder
    occurredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    type?: SortOrder
    note?: SortOrder
    occurredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityMinOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    type?: SortOrder
    note?: SortOrder
    occurredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumActivityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityType | EnumActivityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActivityTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActivityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActivityTypeFilter<$PrismaModel>
    _max?: NestedEnumActivityTypeFilter<$PrismaModel>
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type ProjectFeedbackListRelationFilter = {
    every?: ProjectFeedbackWhereInput
    some?: ProjectFeedbackWhereInput
    none?: ProjectFeedbackWhereInput
  }

  export type ProjectInvoiceNullableScalarRelationFilter = {
    is?: ProjectInvoiceWhereInput | null
    isNot?: ProjectInvoiceWhereInput | null
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectFeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    title?: SortOrder
    portalToken?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    review?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    title?: SortOrder
    portalToken?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    review?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    title?: SortOrder
    portalToken?: SortOrder
    status?: SortOrder
    rating?: SortOrder
    review?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeFilter<$PrismaModel> | $Enums.FileType
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    key?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    type?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    key?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    type?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    key?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    type?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.FileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileTypeFilter<$PrismaModel>
    _max?: NestedEnumFileTypeFilter<$PrismaModel>
  }

  export type ProjectFileNullableScalarRelationFilter = {
    is?: ProjectFileWhereInput | null
    isNot?: ProjectFileWhereInput | null
  }

  export type ProjectFeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    resolved?: SortOrder
    createdAt?: SortOrder
    fileId?: SortOrder
    timestamp?: SortOrder
  }

  export type ProjectFeedbackAvgOrderByAggregateInput = {
    timestamp?: SortOrder
  }

  export type ProjectFeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    resolved?: SortOrder
    createdAt?: SortOrder
    fileId?: SortOrder
    timestamp?: SortOrder
  }

  export type ProjectFeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    resolved?: SortOrder
    createdAt?: SortOrder
    fileId?: SortOrder
    timestamp?: SortOrder
  }

  export type ProjectFeedbackSumOrderByAggregateInput = {
    timestamp?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    invoiceNumber?: SortOrder
    issuedAt?: SortOrder
    dueAt?: SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
    notes?: SortOrder
    stripePaymentUrl?: SortOrder
    paidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectInvoiceAvgOrderByAggregateInput = {
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
  }

  export type ProjectInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    invoiceNumber?: SortOrder
    issuedAt?: SortOrder
    dueAt?: SortOrder
    currency?: SortOrder
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
    notes?: SortOrder
    stripePaymentUrl?: SortOrder
    paidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    invoiceNumber?: SortOrder
    issuedAt?: SortOrder
    dueAt?: SortOrder
    currency?: SortOrder
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
    notes?: SortOrder
    stripePaymentUrl?: SortOrder
    paidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectInvoiceSumOrderByAggregateInput = {
    subtotalCents?: SortOrder
    taxCents?: SortOrder
    totalCents?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AgentRunCountOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    mode?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    status?: SortOrder
    totals?: SortOrder
    error?: SortOrder
  }

  export type AgentRunMaxOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    mode?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    status?: SortOrder
    error?: SortOrder
  }

  export type AgentRunMinOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    mode?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    status?: SortOrder
    error?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ContactInfoArtistIdEmailCompoundUniqueInput = {
    artistId: string
    email: string
  }

  export type ContactInfoCountOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    email?: SortOrder
    confidence?: SortOrder
    score?: SortOrder
    sourceUrl?: SortOrder
    sourceType?: SortOrder
    discoveredAt?: SortOrder
  }

  export type ContactInfoAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ContactInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    email?: SortOrder
    confidence?: SortOrder
    score?: SortOrder
    sourceUrl?: SortOrder
    sourceType?: SortOrder
    discoveredAt?: SortOrder
  }

  export type ContactInfoMinOrderByAggregateInput = {
    id?: SortOrder
    artistId?: SortOrder
    email?: SortOrder
    confidence?: SortOrder
    score?: SortOrder
    sourceUrl?: SortOrder
    sourceType?: SortOrder
    discoveredAt?: SortOrder
  }

  export type ContactInfoSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MergeProposalCountOrderByAggregateInput = {
    id?: SortOrder
    primaryArtistId?: SortOrder
    duplicateArtistId?: SortOrder
    primaryName?: SortOrder
    duplicateName?: SortOrder
    similarityScore?: SortOrder
    confidence?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MergeProposalAvgOrderByAggregateInput = {
    similarityScore?: SortOrder
  }

  export type MergeProposalMaxOrderByAggregateInput = {
    id?: SortOrder
    primaryArtistId?: SortOrder
    duplicateArtistId?: SortOrder
    primaryName?: SortOrder
    duplicateName?: SortOrder
    similarityScore?: SortOrder
    confidence?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MergeProposalMinOrderByAggregateInput = {
    id?: SortOrder
    primaryArtistId?: SortOrder
    duplicateArtistId?: SortOrder
    primaryName?: SortOrder
    duplicateName?: SortOrder
    similarityScore?: SortOrder
    confidence?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MergeProposalSumOrderByAggregateInput = {
    similarityScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ArtistCreatetagsInput = {
    set: string[]
  }

  export type ArtistCreateemailsInput = {
    set: string[]
  }

  export type LeadCreateNestedManyWithoutArtistInput = {
    create?: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput> | LeadCreateWithoutArtistInput[] | LeadUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutArtistInput | LeadCreateOrConnectWithoutArtistInput[]
    createMany?: LeadCreateManyArtistInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type ReleaseCreateNestedManyWithoutArtistInput = {
    create?: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput> | ReleaseCreateWithoutArtistInput[] | ReleaseUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ReleaseCreateOrConnectWithoutArtistInput | ReleaseCreateOrConnectWithoutArtistInput[]
    createMany?: ReleaseCreateManyArtistInputEnvelope
    connect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
  }

  export type InstagramPostCreateNestedManyWithoutArtistInput = {
    create?: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput> | InstagramPostCreateWithoutArtistInput[] | InstagramPostUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: InstagramPostCreateOrConnectWithoutArtistInput | InstagramPostCreateOrConnectWithoutArtistInput[]
    createMany?: InstagramPostCreateManyArtistInputEnvelope
    connect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutArtistInput = {
    create?: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput> | ProjectCreateWithoutArtistInput[] | ProjectUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArtistInput | ProjectCreateOrConnectWithoutArtistInput[]
    createMany?: ProjectCreateManyArtistInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ContactInfoCreateNestedManyWithoutArtistInput = {
    create?: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput> | ContactInfoCreateWithoutArtistInput[] | ContactInfoUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ContactInfoCreateOrConnectWithoutArtistInput | ContactInfoCreateOrConnectWithoutArtistInput[]
    createMany?: ContactInfoCreateManyArtistInputEnvelope
    connect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
  }

  export type MergeProposalCreateNestedManyWithoutPrimaryArtistInput = {
    create?: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput> | MergeProposalCreateWithoutPrimaryArtistInput[] | MergeProposalUncheckedCreateWithoutPrimaryArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutPrimaryArtistInput | MergeProposalCreateOrConnectWithoutPrimaryArtistInput[]
    createMany?: MergeProposalCreateManyPrimaryArtistInputEnvelope
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
  }

  export type MergeProposalCreateNestedManyWithoutDuplicateArtistInput = {
    create?: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput> | MergeProposalCreateWithoutDuplicateArtistInput[] | MergeProposalUncheckedCreateWithoutDuplicateArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutDuplicateArtistInput | MergeProposalCreateOrConnectWithoutDuplicateArtistInput[]
    createMany?: MergeProposalCreateManyDuplicateArtistInputEnvelope
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
  }

  export type LeadUncheckedCreateNestedManyWithoutArtistInput = {
    create?: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput> | LeadCreateWithoutArtistInput[] | LeadUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutArtistInput | LeadCreateOrConnectWithoutArtistInput[]
    createMany?: LeadCreateManyArtistInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type ReleaseUncheckedCreateNestedManyWithoutArtistInput = {
    create?: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput> | ReleaseCreateWithoutArtistInput[] | ReleaseUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ReleaseCreateOrConnectWithoutArtistInput | ReleaseCreateOrConnectWithoutArtistInput[]
    createMany?: ReleaseCreateManyArtistInputEnvelope
    connect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
  }

  export type InstagramPostUncheckedCreateNestedManyWithoutArtistInput = {
    create?: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput> | InstagramPostCreateWithoutArtistInput[] | InstagramPostUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: InstagramPostCreateOrConnectWithoutArtistInput | InstagramPostCreateOrConnectWithoutArtistInput[]
    createMany?: InstagramPostCreateManyArtistInputEnvelope
    connect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutArtistInput = {
    create?: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput> | ProjectCreateWithoutArtistInput[] | ProjectUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArtistInput | ProjectCreateOrConnectWithoutArtistInput[]
    createMany?: ProjectCreateManyArtistInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ContactInfoUncheckedCreateNestedManyWithoutArtistInput = {
    create?: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput> | ContactInfoCreateWithoutArtistInput[] | ContactInfoUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ContactInfoCreateOrConnectWithoutArtistInput | ContactInfoCreateOrConnectWithoutArtistInput[]
    createMany?: ContactInfoCreateManyArtistInputEnvelope
    connect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
  }

  export type MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput = {
    create?: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput> | MergeProposalCreateWithoutPrimaryArtistInput[] | MergeProposalUncheckedCreateWithoutPrimaryArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutPrimaryArtistInput | MergeProposalCreateOrConnectWithoutPrimaryArtistInput[]
    createMany?: MergeProposalCreateManyPrimaryArtistInputEnvelope
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
  }

  export type MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput = {
    create?: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput> | MergeProposalCreateWithoutDuplicateArtistInput[] | MergeProposalUncheckedCreateWithoutDuplicateArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutDuplicateArtistInput | MergeProposalCreateOrConnectWithoutDuplicateArtistInput[]
    createMany?: MergeProposalCreateManyDuplicateArtistInputEnvelope
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ArtistUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ArtistUpdateemailsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LeadUpdateManyWithoutArtistNestedInput = {
    create?: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput> | LeadCreateWithoutArtistInput[] | LeadUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutArtistInput | LeadCreateOrConnectWithoutArtistInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutArtistInput | LeadUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: LeadCreateManyArtistInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutArtistInput | LeadUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutArtistInput | LeadUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type ReleaseUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput> | ReleaseCreateWithoutArtistInput[] | ReleaseUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ReleaseCreateOrConnectWithoutArtistInput | ReleaseCreateOrConnectWithoutArtistInput[]
    upsert?: ReleaseUpsertWithWhereUniqueWithoutArtistInput | ReleaseUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ReleaseCreateManyArtistInputEnvelope
    set?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    disconnect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    delete?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    connect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    update?: ReleaseUpdateWithWhereUniqueWithoutArtistInput | ReleaseUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ReleaseUpdateManyWithWhereWithoutArtistInput | ReleaseUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ReleaseScalarWhereInput | ReleaseScalarWhereInput[]
  }

  export type InstagramPostUpdateManyWithoutArtistNestedInput = {
    create?: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput> | InstagramPostCreateWithoutArtistInput[] | InstagramPostUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: InstagramPostCreateOrConnectWithoutArtistInput | InstagramPostCreateOrConnectWithoutArtistInput[]
    upsert?: InstagramPostUpsertWithWhereUniqueWithoutArtistInput | InstagramPostUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: InstagramPostCreateManyArtistInputEnvelope
    set?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    disconnect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    delete?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    connect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    update?: InstagramPostUpdateWithWhereUniqueWithoutArtistInput | InstagramPostUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: InstagramPostUpdateManyWithWhereWithoutArtistInput | InstagramPostUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: InstagramPostScalarWhereInput | InstagramPostScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput> | ProjectCreateWithoutArtistInput[] | ProjectUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArtistInput | ProjectCreateOrConnectWithoutArtistInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutArtistInput | ProjectUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ProjectCreateManyArtistInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutArtistInput | ProjectUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutArtistInput | ProjectUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ContactInfoUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput> | ContactInfoCreateWithoutArtistInput[] | ContactInfoUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ContactInfoCreateOrConnectWithoutArtistInput | ContactInfoCreateOrConnectWithoutArtistInput[]
    upsert?: ContactInfoUpsertWithWhereUniqueWithoutArtistInput | ContactInfoUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ContactInfoCreateManyArtistInputEnvelope
    set?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    disconnect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    delete?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    connect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    update?: ContactInfoUpdateWithWhereUniqueWithoutArtistInput | ContactInfoUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ContactInfoUpdateManyWithWhereWithoutArtistInput | ContactInfoUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ContactInfoScalarWhereInput | ContactInfoScalarWhereInput[]
  }

  export type MergeProposalUpdateManyWithoutPrimaryArtistNestedInput = {
    create?: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput> | MergeProposalCreateWithoutPrimaryArtistInput[] | MergeProposalUncheckedCreateWithoutPrimaryArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutPrimaryArtistInput | MergeProposalCreateOrConnectWithoutPrimaryArtistInput[]
    upsert?: MergeProposalUpsertWithWhereUniqueWithoutPrimaryArtistInput | MergeProposalUpsertWithWhereUniqueWithoutPrimaryArtistInput[]
    createMany?: MergeProposalCreateManyPrimaryArtistInputEnvelope
    set?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    disconnect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    delete?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    update?: MergeProposalUpdateWithWhereUniqueWithoutPrimaryArtistInput | MergeProposalUpdateWithWhereUniqueWithoutPrimaryArtistInput[]
    updateMany?: MergeProposalUpdateManyWithWhereWithoutPrimaryArtistInput | MergeProposalUpdateManyWithWhereWithoutPrimaryArtistInput[]
    deleteMany?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
  }

  export type MergeProposalUpdateManyWithoutDuplicateArtistNestedInput = {
    create?: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput> | MergeProposalCreateWithoutDuplicateArtistInput[] | MergeProposalUncheckedCreateWithoutDuplicateArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutDuplicateArtistInput | MergeProposalCreateOrConnectWithoutDuplicateArtistInput[]
    upsert?: MergeProposalUpsertWithWhereUniqueWithoutDuplicateArtistInput | MergeProposalUpsertWithWhereUniqueWithoutDuplicateArtistInput[]
    createMany?: MergeProposalCreateManyDuplicateArtistInputEnvelope
    set?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    disconnect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    delete?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    update?: MergeProposalUpdateWithWhereUniqueWithoutDuplicateArtistInput | MergeProposalUpdateWithWhereUniqueWithoutDuplicateArtistInput[]
    updateMany?: MergeProposalUpdateManyWithWhereWithoutDuplicateArtistInput | MergeProposalUpdateManyWithWhereWithoutDuplicateArtistInput[]
    deleteMany?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
  }

  export type LeadUncheckedUpdateManyWithoutArtistNestedInput = {
    create?: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput> | LeadCreateWithoutArtistInput[] | LeadUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutArtistInput | LeadCreateOrConnectWithoutArtistInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutArtistInput | LeadUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: LeadCreateManyArtistInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutArtistInput | LeadUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutArtistInput | LeadUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type ReleaseUncheckedUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput> | ReleaseCreateWithoutArtistInput[] | ReleaseUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ReleaseCreateOrConnectWithoutArtistInput | ReleaseCreateOrConnectWithoutArtistInput[]
    upsert?: ReleaseUpsertWithWhereUniqueWithoutArtistInput | ReleaseUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ReleaseCreateManyArtistInputEnvelope
    set?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    disconnect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    delete?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    connect?: ReleaseWhereUniqueInput | ReleaseWhereUniqueInput[]
    update?: ReleaseUpdateWithWhereUniqueWithoutArtistInput | ReleaseUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ReleaseUpdateManyWithWhereWithoutArtistInput | ReleaseUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ReleaseScalarWhereInput | ReleaseScalarWhereInput[]
  }

  export type InstagramPostUncheckedUpdateManyWithoutArtistNestedInput = {
    create?: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput> | InstagramPostCreateWithoutArtistInput[] | InstagramPostUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: InstagramPostCreateOrConnectWithoutArtistInput | InstagramPostCreateOrConnectWithoutArtistInput[]
    upsert?: InstagramPostUpsertWithWhereUniqueWithoutArtistInput | InstagramPostUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: InstagramPostCreateManyArtistInputEnvelope
    set?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    disconnect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    delete?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    connect?: InstagramPostWhereUniqueInput | InstagramPostWhereUniqueInput[]
    update?: InstagramPostUpdateWithWhereUniqueWithoutArtistInput | InstagramPostUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: InstagramPostUpdateManyWithWhereWithoutArtistInput | InstagramPostUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: InstagramPostScalarWhereInput | InstagramPostScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput> | ProjectCreateWithoutArtistInput[] | ProjectUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArtistInput | ProjectCreateOrConnectWithoutArtistInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutArtistInput | ProjectUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ProjectCreateManyArtistInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutArtistInput | ProjectUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutArtistInput | ProjectUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ContactInfoUncheckedUpdateManyWithoutArtistNestedInput = {
    create?: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput> | ContactInfoCreateWithoutArtistInput[] | ContactInfoUncheckedCreateWithoutArtistInput[]
    connectOrCreate?: ContactInfoCreateOrConnectWithoutArtistInput | ContactInfoCreateOrConnectWithoutArtistInput[]
    upsert?: ContactInfoUpsertWithWhereUniqueWithoutArtistInput | ContactInfoUpsertWithWhereUniqueWithoutArtistInput[]
    createMany?: ContactInfoCreateManyArtistInputEnvelope
    set?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    disconnect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    delete?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    connect?: ContactInfoWhereUniqueInput | ContactInfoWhereUniqueInput[]
    update?: ContactInfoUpdateWithWhereUniqueWithoutArtistInput | ContactInfoUpdateWithWhereUniqueWithoutArtistInput[]
    updateMany?: ContactInfoUpdateManyWithWhereWithoutArtistInput | ContactInfoUpdateManyWithWhereWithoutArtistInput[]
    deleteMany?: ContactInfoScalarWhereInput | ContactInfoScalarWhereInput[]
  }

  export type MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput = {
    create?: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput> | MergeProposalCreateWithoutPrimaryArtistInput[] | MergeProposalUncheckedCreateWithoutPrimaryArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutPrimaryArtistInput | MergeProposalCreateOrConnectWithoutPrimaryArtistInput[]
    upsert?: MergeProposalUpsertWithWhereUniqueWithoutPrimaryArtistInput | MergeProposalUpsertWithWhereUniqueWithoutPrimaryArtistInput[]
    createMany?: MergeProposalCreateManyPrimaryArtistInputEnvelope
    set?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    disconnect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    delete?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    update?: MergeProposalUpdateWithWhereUniqueWithoutPrimaryArtistInput | MergeProposalUpdateWithWhereUniqueWithoutPrimaryArtistInput[]
    updateMany?: MergeProposalUpdateManyWithWhereWithoutPrimaryArtistInput | MergeProposalUpdateManyWithWhereWithoutPrimaryArtistInput[]
    deleteMany?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
  }

  export type MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput = {
    create?: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput> | MergeProposalCreateWithoutDuplicateArtistInput[] | MergeProposalUncheckedCreateWithoutDuplicateArtistInput[]
    connectOrCreate?: MergeProposalCreateOrConnectWithoutDuplicateArtistInput | MergeProposalCreateOrConnectWithoutDuplicateArtistInput[]
    upsert?: MergeProposalUpsertWithWhereUniqueWithoutDuplicateArtistInput | MergeProposalUpsertWithWhereUniqueWithoutDuplicateArtistInput[]
    createMany?: MergeProposalCreateManyDuplicateArtistInputEnvelope
    set?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    disconnect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    delete?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    connect?: MergeProposalWhereUniqueInput | MergeProposalWhereUniqueInput[]
    update?: MergeProposalUpdateWithWhereUniqueWithoutDuplicateArtistInput | MergeProposalUpdateWithWhereUniqueWithoutDuplicateArtistInput[]
    updateMany?: MergeProposalUpdateManyWithWhereWithoutDuplicateArtistInput | MergeProposalUpdateManyWithWhereWithoutDuplicateArtistInput[]
    deleteMany?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
  }

  export type ArtistCreateNestedOneWithoutLeadsInput = {
    create?: XOR<ArtistCreateWithoutLeadsInput, ArtistUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutLeadsInput
    connect?: ArtistWhereUniqueInput
  }

  export type MessageDraftCreateNestedManyWithoutLeadInput = {
    create?: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput> | MessageDraftCreateWithoutLeadInput[] | MessageDraftUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageDraftCreateOrConnectWithoutLeadInput | MessageDraftCreateOrConnectWithoutLeadInput[]
    createMany?: MessageDraftCreateManyLeadInputEnvelope
    connect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
  }

  export type ActivityCreateNestedManyWithoutLeadInput = {
    create?: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput> | ActivityCreateWithoutLeadInput[] | ActivityUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutLeadInput | ActivityCreateOrConnectWithoutLeadInput[]
    createMany?: ActivityCreateManyLeadInputEnvelope
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
  }

  export type MessageDraftUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput> | MessageDraftCreateWithoutLeadInput[] | MessageDraftUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageDraftCreateOrConnectWithoutLeadInput | MessageDraftCreateOrConnectWithoutLeadInput[]
    createMany?: MessageDraftCreateManyLeadInputEnvelope
    connect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
  }

  export type ActivityUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput> | ActivityCreateWithoutLeadInput[] | ActivityUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutLeadInput | ActivityCreateOrConnectWithoutLeadInput[]
    createMany?: ActivityCreateManyLeadInputEnvelope
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
  }

  export type EnumLeadStatusFieldUpdateOperationsInput = {
    set?: $Enums.LeadStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ArtistUpdateOneRequiredWithoutLeadsNestedInput = {
    create?: XOR<ArtistCreateWithoutLeadsInput, ArtistUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutLeadsInput
    upsert?: ArtistUpsertWithoutLeadsInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutLeadsInput, ArtistUpdateWithoutLeadsInput>, ArtistUncheckedUpdateWithoutLeadsInput>
  }

  export type MessageDraftUpdateManyWithoutLeadNestedInput = {
    create?: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput> | MessageDraftCreateWithoutLeadInput[] | MessageDraftUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageDraftCreateOrConnectWithoutLeadInput | MessageDraftCreateOrConnectWithoutLeadInput[]
    upsert?: MessageDraftUpsertWithWhereUniqueWithoutLeadInput | MessageDraftUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: MessageDraftCreateManyLeadInputEnvelope
    set?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    disconnect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    delete?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    connect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    update?: MessageDraftUpdateWithWhereUniqueWithoutLeadInput | MessageDraftUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: MessageDraftUpdateManyWithWhereWithoutLeadInput | MessageDraftUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: MessageDraftScalarWhereInput | MessageDraftScalarWhereInput[]
  }

  export type ActivityUpdateManyWithoutLeadNestedInput = {
    create?: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput> | ActivityCreateWithoutLeadInput[] | ActivityUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutLeadInput | ActivityCreateOrConnectWithoutLeadInput[]
    upsert?: ActivityUpsertWithWhereUniqueWithoutLeadInput | ActivityUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: ActivityCreateManyLeadInputEnvelope
    set?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    disconnect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    delete?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    update?: ActivityUpdateWithWhereUniqueWithoutLeadInput | ActivityUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: ActivityUpdateManyWithWhereWithoutLeadInput | ActivityUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
  }

  export type MessageDraftUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput> | MessageDraftCreateWithoutLeadInput[] | MessageDraftUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageDraftCreateOrConnectWithoutLeadInput | MessageDraftCreateOrConnectWithoutLeadInput[]
    upsert?: MessageDraftUpsertWithWhereUniqueWithoutLeadInput | MessageDraftUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: MessageDraftCreateManyLeadInputEnvelope
    set?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    disconnect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    delete?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    connect?: MessageDraftWhereUniqueInput | MessageDraftWhereUniqueInput[]
    update?: MessageDraftUpdateWithWhereUniqueWithoutLeadInput | MessageDraftUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: MessageDraftUpdateManyWithWhereWithoutLeadInput | MessageDraftUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: MessageDraftScalarWhereInput | MessageDraftScalarWhereInput[]
  }

  export type ActivityUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput> | ActivityCreateWithoutLeadInput[] | ActivityUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutLeadInput | ActivityCreateOrConnectWithoutLeadInput[]
    upsert?: ActivityUpsertWithWhereUniqueWithoutLeadInput | ActivityUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: ActivityCreateManyLeadInputEnvelope
    set?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    disconnect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    delete?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    update?: ActivityUpdateWithWhereUniqueWithoutLeadInput | ActivityUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: ActivityUpdateManyWithWhereWithoutLeadInput | ActivityUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
  }

  export type ArtistCreateNestedOneWithoutReleasesInput = {
    create?: XOR<ArtistCreateWithoutReleasesInput, ArtistUncheckedCreateWithoutReleasesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutReleasesInput
    connect?: ArtistWhereUniqueInput
  }

  export type ArtistUpdateOneRequiredWithoutReleasesNestedInput = {
    create?: XOR<ArtistCreateWithoutReleasesInput, ArtistUncheckedCreateWithoutReleasesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutReleasesInput
    upsert?: ArtistUpsertWithoutReleasesInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutReleasesInput, ArtistUpdateWithoutReleasesInput>, ArtistUncheckedUpdateWithoutReleasesInput>
  }

  export type ArtistCreateNestedOneWithoutInstagramPostsInput = {
    create?: XOR<ArtistCreateWithoutInstagramPostsInput, ArtistUncheckedCreateWithoutInstagramPostsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutInstagramPostsInput
    connect?: ArtistWhereUniqueInput
  }

  export type ArtistUpdateOneRequiredWithoutInstagramPostsNestedInput = {
    create?: XOR<ArtistCreateWithoutInstagramPostsInput, ArtistUncheckedCreateWithoutInstagramPostsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutInstagramPostsInput
    upsert?: ArtistUpsertWithoutInstagramPostsInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutInstagramPostsInput, ArtistUpdateWithoutInstagramPostsInput>, ArtistUncheckedUpdateWithoutInstagramPostsInput>
  }

  export type LeadCreateNestedOneWithoutMessagesInput = {
    create?: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutMessagesInput
    connect?: LeadWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LeadUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutMessagesInput
    upsert?: LeadUpsertWithoutMessagesInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutMessagesInput, LeadUpdateWithoutMessagesInput>, LeadUncheckedUpdateWithoutMessagesInput>
  }

  export type LeadCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<LeadCreateWithoutActivitiesInput, LeadUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutActivitiesInput
    connect?: LeadWhereUniqueInput
  }

  export type EnumActivityTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActivityType
  }

  export type LeadUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<LeadCreateWithoutActivitiesInput, LeadUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutActivitiesInput
    upsert?: LeadUpsertWithoutActivitiesInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutActivitiesInput, LeadUpdateWithoutActivitiesInput>, LeadUncheckedUpdateWithoutActivitiesInput>
  }

  export type ArtistCreateNestedOneWithoutProjectsInput = {
    create?: XOR<ArtistCreateWithoutProjectsInput, ArtistUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutProjectsInput
    connect?: ArtistWhereUniqueInput
  }

  export type ProjectFileCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectFeedbackCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput> | ProjectFeedbackCreateWithoutProjectInput[] | ProjectFeedbackUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutProjectInput | ProjectFeedbackCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFeedbackCreateManyProjectInputEnvelope
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
  }

  export type ProjectInvoiceCreateNestedOneWithoutProjectInput = {
    create?: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectInvoiceCreateOrConnectWithoutProjectInput
    connect?: ProjectInvoiceWhereUniqueInput
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectFeedbackUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput> | ProjectFeedbackCreateWithoutProjectInput[] | ProjectFeedbackUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutProjectInput | ProjectFeedbackCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFeedbackCreateManyProjectInputEnvelope
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
  }

  export type ProjectInvoiceUncheckedCreateNestedOneWithoutProjectInput = {
    create?: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectInvoiceCreateOrConnectWithoutProjectInput
    connect?: ProjectInvoiceWhereUniqueInput
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type ArtistUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<ArtistCreateWithoutProjectsInput, ArtistUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutProjectsInput
    upsert?: ArtistUpsertWithoutProjectsInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutProjectsInput, ArtistUpdateWithoutProjectsInput>, ArtistUncheckedUpdateWithoutProjectsInput>
  }

  export type ProjectFileUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectFeedbackUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput> | ProjectFeedbackCreateWithoutProjectInput[] | ProjectFeedbackUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutProjectInput | ProjectFeedbackCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFeedbackUpsertWithWhereUniqueWithoutProjectInput | ProjectFeedbackUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFeedbackCreateManyProjectInputEnvelope
    set?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    disconnect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    delete?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    update?: ProjectFeedbackUpdateWithWhereUniqueWithoutProjectInput | ProjectFeedbackUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFeedbackUpdateManyWithWhereWithoutProjectInput | ProjectFeedbackUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
  }

  export type ProjectInvoiceUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectInvoiceCreateOrConnectWithoutProjectInput
    upsert?: ProjectInvoiceUpsertWithoutProjectInput
    disconnect?: ProjectInvoiceWhereInput | boolean
    delete?: ProjectInvoiceWhereInput | boolean
    connect?: ProjectInvoiceWhereUniqueInput
    update?: XOR<XOR<ProjectInvoiceUpdateToOneWithWhereWithoutProjectInput, ProjectInvoiceUpdateWithoutProjectInput>, ProjectInvoiceUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectFeedbackUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput> | ProjectFeedbackCreateWithoutProjectInput[] | ProjectFeedbackUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutProjectInput | ProjectFeedbackCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFeedbackUpsertWithWhereUniqueWithoutProjectInput | ProjectFeedbackUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFeedbackCreateManyProjectInputEnvelope
    set?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    disconnect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    delete?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    update?: ProjectFeedbackUpdateWithWhereUniqueWithoutProjectInput | ProjectFeedbackUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFeedbackUpdateManyWithWhereWithoutProjectInput | ProjectFeedbackUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
  }

  export type ProjectInvoiceUncheckedUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ProjectInvoiceCreateOrConnectWithoutProjectInput
    upsert?: ProjectInvoiceUpsertWithoutProjectInput
    disconnect?: ProjectInvoiceWhereInput | boolean
    delete?: ProjectInvoiceWhereInput | boolean
    connect?: ProjectInvoiceWhereUniqueInput
    update?: XOR<XOR<ProjectInvoiceUpdateToOneWithWhereWithoutProjectInput, ProjectInvoiceUpdateWithoutProjectInput>, ProjectInvoiceUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectFeedbackCreateNestedManyWithoutFileInput = {
    create?: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput> | ProjectFeedbackCreateWithoutFileInput[] | ProjectFeedbackUncheckedCreateWithoutFileInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutFileInput | ProjectFeedbackCreateOrConnectWithoutFileInput[]
    createMany?: ProjectFeedbackCreateManyFileInputEnvelope
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
  }

  export type ProjectFeedbackUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput> | ProjectFeedbackCreateWithoutFileInput[] | ProjectFeedbackUncheckedCreateWithoutFileInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutFileInput | ProjectFeedbackCreateOrConnectWithoutFileInput[]
    createMany?: ProjectFeedbackCreateManyFileInputEnvelope
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumFileTypeFieldUpdateOperationsInput = {
    set?: $Enums.FileType
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectFeedbackUpdateManyWithoutFileNestedInput = {
    create?: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput> | ProjectFeedbackCreateWithoutFileInput[] | ProjectFeedbackUncheckedCreateWithoutFileInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutFileInput | ProjectFeedbackCreateOrConnectWithoutFileInput[]
    upsert?: ProjectFeedbackUpsertWithWhereUniqueWithoutFileInput | ProjectFeedbackUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: ProjectFeedbackCreateManyFileInputEnvelope
    set?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    disconnect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    delete?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    update?: ProjectFeedbackUpdateWithWhereUniqueWithoutFileInput | ProjectFeedbackUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: ProjectFeedbackUpdateManyWithWhereWithoutFileInput | ProjectFeedbackUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
  }

  export type ProjectFeedbackUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput> | ProjectFeedbackCreateWithoutFileInput[] | ProjectFeedbackUncheckedCreateWithoutFileInput[]
    connectOrCreate?: ProjectFeedbackCreateOrConnectWithoutFileInput | ProjectFeedbackCreateOrConnectWithoutFileInput[]
    upsert?: ProjectFeedbackUpsertWithWhereUniqueWithoutFileInput | ProjectFeedbackUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: ProjectFeedbackCreateManyFileInputEnvelope
    set?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    disconnect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    delete?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    connect?: ProjectFeedbackWhereUniqueInput | ProjectFeedbackWhereUniqueInput[]
    update?: ProjectFeedbackUpdateWithWhereUniqueWithoutFileInput | ProjectFeedbackUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: ProjectFeedbackUpdateManyWithWhereWithoutFileInput | ProjectFeedbackUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<ProjectCreateWithoutFeedbacksInput, ProjectUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFeedbacksInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectFileCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<ProjectFileCreateWithoutFeedbacksInput, ProjectFileUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: ProjectFileCreateOrConnectWithoutFeedbacksInput
    connect?: ProjectFileWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutFeedbacksNestedInput = {
    create?: XOR<ProjectCreateWithoutFeedbacksInput, ProjectUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFeedbacksInput
    upsert?: ProjectUpsertWithoutFeedbacksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFeedbacksInput, ProjectUpdateWithoutFeedbacksInput>, ProjectUncheckedUpdateWithoutFeedbacksInput>
  }

  export type ProjectFileUpdateOneWithoutFeedbacksNestedInput = {
    create?: XOR<ProjectFileCreateWithoutFeedbacksInput, ProjectFileUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: ProjectFileCreateOrConnectWithoutFeedbacksInput
    upsert?: ProjectFileUpsertWithoutFeedbacksInput
    disconnect?: ProjectFileWhereInput | boolean
    delete?: ProjectFileWhereInput | boolean
    connect?: ProjectFileWhereUniqueInput
    update?: XOR<XOR<ProjectFileUpdateToOneWithWhereWithoutFeedbacksInput, ProjectFileUpdateWithoutFeedbacksInput>, ProjectFileUncheckedUpdateWithoutFeedbacksInput>
  }

  export type ProjectCreateNestedOneWithoutInvoiceInput = {
    create?: XOR<ProjectCreateWithoutInvoiceInput, ProjectUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutInvoiceInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutInvoiceNestedInput = {
    create?: XOR<ProjectCreateWithoutInvoiceInput, ProjectUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutInvoiceInput
    upsert?: ProjectUpsertWithoutInvoiceInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutInvoiceInput, ProjectUpdateWithoutInvoiceInput>, ProjectUncheckedUpdateWithoutInvoiceInput>
  }

  export type ArtistCreateNestedOneWithoutContactInfosInput = {
    create?: XOR<ArtistCreateWithoutContactInfosInput, ArtistUncheckedCreateWithoutContactInfosInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutContactInfosInput
    connect?: ArtistWhereUniqueInput
  }

  export type ArtistUpdateOneRequiredWithoutContactInfosNestedInput = {
    create?: XOR<ArtistCreateWithoutContactInfosInput, ArtistUncheckedCreateWithoutContactInfosInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutContactInfosInput
    upsert?: ArtistUpsertWithoutContactInfosInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutContactInfosInput, ArtistUpdateWithoutContactInfosInput>, ArtistUncheckedUpdateWithoutContactInfosInput>
  }

  export type ArtistCreateNestedOneWithoutPrimaryMergesInput = {
    create?: XOR<ArtistCreateWithoutPrimaryMergesInput, ArtistUncheckedCreateWithoutPrimaryMergesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutPrimaryMergesInput
    connect?: ArtistWhereUniqueInput
  }

  export type ArtistCreateNestedOneWithoutDuplicateMergesInput = {
    create?: XOR<ArtistCreateWithoutDuplicateMergesInput, ArtistUncheckedCreateWithoutDuplicateMergesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutDuplicateMergesInput
    connect?: ArtistWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ArtistUpdateOneRequiredWithoutPrimaryMergesNestedInput = {
    create?: XOR<ArtistCreateWithoutPrimaryMergesInput, ArtistUncheckedCreateWithoutPrimaryMergesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutPrimaryMergesInput
    upsert?: ArtistUpsertWithoutPrimaryMergesInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutPrimaryMergesInput, ArtistUpdateWithoutPrimaryMergesInput>, ArtistUncheckedUpdateWithoutPrimaryMergesInput>
  }

  export type ArtistUpdateOneRequiredWithoutDuplicateMergesNestedInput = {
    create?: XOR<ArtistCreateWithoutDuplicateMergesInput, ArtistUncheckedCreateWithoutDuplicateMergesInput>
    connectOrCreate?: ArtistCreateOrConnectWithoutDuplicateMergesInput
    upsert?: ArtistUpsertWithoutDuplicateMergesInput
    connect?: ArtistWhereUniqueInput
    update?: XOR<XOR<ArtistUpdateToOneWithWhereWithoutDuplicateMergesInput, ArtistUpdateWithoutDuplicateMergesInput>, ArtistUncheckedUpdateWithoutDuplicateMergesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumActivityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityType | EnumActivityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActivityTypeFilter<$PrismaModel> | $Enums.ActivityType
  }

  export type NestedEnumActivityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityType | EnumActivityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActivityType[] | ListEnumActivityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActivityTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActivityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActivityTypeFilter<$PrismaModel>
    _max?: NestedEnumActivityTypeFilter<$PrismaModel>
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedEnumFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeFilter<$PrismaModel> | $Enums.FileType
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.FileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileTypeFilter<$PrismaModel>
    _max?: NestedEnumFileTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LeadCreateWithoutArtistInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageDraftCreateNestedManyWithoutLeadInput
    activities?: ActivityCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutArtistInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageDraftUncheckedCreateNestedManyWithoutLeadInput
    activities?: ActivityUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutArtistInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput>
  }

  export type LeadCreateManyArtistInputEnvelope = {
    data: LeadCreateManyArtistInput | LeadCreateManyArtistInput[]
    skipDuplicates?: boolean
  }

  export type ReleaseCreateWithoutArtistInput = {
    id?: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
  }

  export type ReleaseUncheckedCreateWithoutArtistInput = {
    id?: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
  }

  export type ReleaseCreateOrConnectWithoutArtistInput = {
    where: ReleaseWhereUniqueInput
    create: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput>
  }

  export type ReleaseCreateManyArtistInputEnvelope = {
    data: ReleaseCreateManyArtistInput | ReleaseCreateManyArtistInput[]
    skipDuplicates?: boolean
  }

  export type InstagramPostCreateWithoutArtistInput = {
    id?: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
  }

  export type InstagramPostUncheckedCreateWithoutArtistInput = {
    id?: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
  }

  export type InstagramPostCreateOrConnectWithoutArtistInput = {
    where: InstagramPostWhereUniqueInput
    create: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput>
  }

  export type InstagramPostCreateManyArtistInputEnvelope = {
    data: InstagramPostCreateManyArtistInput | InstagramPostCreateManyArtistInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutArtistInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutArtistInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutArtistInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput>
  }

  export type ProjectCreateManyArtistInputEnvelope = {
    data: ProjectCreateManyArtistInput | ProjectCreateManyArtistInput[]
    skipDuplicates?: boolean
  }

  export type ContactInfoCreateWithoutArtistInput = {
    id?: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
  }

  export type ContactInfoUncheckedCreateWithoutArtistInput = {
    id?: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
  }

  export type ContactInfoCreateOrConnectWithoutArtistInput = {
    where: ContactInfoWhereUniqueInput
    create: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput>
  }

  export type ContactInfoCreateManyArtistInputEnvelope = {
    data: ContactInfoCreateManyArtistInput | ContactInfoCreateManyArtistInput[]
    skipDuplicates?: boolean
  }

  export type MergeProposalCreateWithoutPrimaryArtistInput = {
    id?: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
    duplicateArtist: ArtistCreateNestedOneWithoutDuplicateMergesInput
  }

  export type MergeProposalUncheckedCreateWithoutPrimaryArtistInput = {
    id?: string
    duplicateArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type MergeProposalCreateOrConnectWithoutPrimaryArtistInput = {
    where: MergeProposalWhereUniqueInput
    create: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput>
  }

  export type MergeProposalCreateManyPrimaryArtistInputEnvelope = {
    data: MergeProposalCreateManyPrimaryArtistInput | MergeProposalCreateManyPrimaryArtistInput[]
    skipDuplicates?: boolean
  }

  export type MergeProposalCreateWithoutDuplicateArtistInput = {
    id?: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
    primaryArtist: ArtistCreateNestedOneWithoutPrimaryMergesInput
  }

  export type MergeProposalUncheckedCreateWithoutDuplicateArtistInput = {
    id?: string
    primaryArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type MergeProposalCreateOrConnectWithoutDuplicateArtistInput = {
    where: MergeProposalWhereUniqueInput
    create: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput>
  }

  export type MergeProposalCreateManyDuplicateArtistInputEnvelope = {
    data: MergeProposalCreateManyDuplicateArtistInput | MergeProposalCreateManyDuplicateArtistInput[]
    skipDuplicates?: boolean
  }

  export type LeadUpsertWithWhereUniqueWithoutArtistInput = {
    where: LeadWhereUniqueInput
    update: XOR<LeadUpdateWithoutArtistInput, LeadUncheckedUpdateWithoutArtistInput>
    create: XOR<LeadCreateWithoutArtistInput, LeadUncheckedCreateWithoutArtistInput>
  }

  export type LeadUpdateWithWhereUniqueWithoutArtistInput = {
    where: LeadWhereUniqueInput
    data: XOR<LeadUpdateWithoutArtistInput, LeadUncheckedUpdateWithoutArtistInput>
  }

  export type LeadUpdateManyWithWhereWithoutArtistInput = {
    where: LeadScalarWhereInput
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyWithoutArtistInput>
  }

  export type LeadScalarWhereInput = {
    AND?: LeadScalarWhereInput | LeadScalarWhereInput[]
    OR?: LeadScalarWhereInput[]
    NOT?: LeadScalarWhereInput | LeadScalarWhereInput[]
    id?: StringFilter<"Lead"> | string
    artistId?: StringFilter<"Lead"> | string
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    score?: FloatNullableFilter<"Lead"> | number | null
    scoreRationale?: StringNullableFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    nextActionAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
  }

  export type ReleaseUpsertWithWhereUniqueWithoutArtistInput = {
    where: ReleaseWhereUniqueInput
    update: XOR<ReleaseUpdateWithoutArtistInput, ReleaseUncheckedUpdateWithoutArtistInput>
    create: XOR<ReleaseCreateWithoutArtistInput, ReleaseUncheckedCreateWithoutArtistInput>
  }

  export type ReleaseUpdateWithWhereUniqueWithoutArtistInput = {
    where: ReleaseWhereUniqueInput
    data: XOR<ReleaseUpdateWithoutArtistInput, ReleaseUncheckedUpdateWithoutArtistInput>
  }

  export type ReleaseUpdateManyWithWhereWithoutArtistInput = {
    where: ReleaseScalarWhereInput
    data: XOR<ReleaseUpdateManyMutationInput, ReleaseUncheckedUpdateManyWithoutArtistInput>
  }

  export type ReleaseScalarWhereInput = {
    AND?: ReleaseScalarWhereInput | ReleaseScalarWhereInput[]
    OR?: ReleaseScalarWhereInput[]
    NOT?: ReleaseScalarWhereInput | ReleaseScalarWhereInput[]
    id?: StringFilter<"Release"> | string
    artistId?: StringFilter<"Release"> | string
    spotifyTrackId?: StringNullableFilter<"Release"> | string | null
    spotifyReleaseId?: StringNullableFilter<"Release"> | string | null
    title?: StringFilter<"Release"> | string
    releaseDate?: DateTimeNullableFilter<"Release"> | Date | string | null
    imageUrl?: StringNullableFilter<"Release"> | string | null
    url?: StringNullableFilter<"Release"> | string | null
    releaseType?: StringNullableFilter<"Release"> | string | null
    createdAt?: DateTimeFilter<"Release"> | Date | string
  }

  export type InstagramPostUpsertWithWhereUniqueWithoutArtistInput = {
    where: InstagramPostWhereUniqueInput
    update: XOR<InstagramPostUpdateWithoutArtistInput, InstagramPostUncheckedUpdateWithoutArtistInput>
    create: XOR<InstagramPostCreateWithoutArtistInput, InstagramPostUncheckedCreateWithoutArtistInput>
  }

  export type InstagramPostUpdateWithWhereUniqueWithoutArtistInput = {
    where: InstagramPostWhereUniqueInput
    data: XOR<InstagramPostUpdateWithoutArtistInput, InstagramPostUncheckedUpdateWithoutArtistInput>
  }

  export type InstagramPostUpdateManyWithWhereWithoutArtistInput = {
    where: InstagramPostScalarWhereInput
    data: XOR<InstagramPostUpdateManyMutationInput, InstagramPostUncheckedUpdateManyWithoutArtistInput>
  }

  export type InstagramPostScalarWhereInput = {
    AND?: InstagramPostScalarWhereInput | InstagramPostScalarWhereInput[]
    OR?: InstagramPostScalarWhereInput[]
    NOT?: InstagramPostScalarWhereInput | InstagramPostScalarWhereInput[]
    id?: StringFilter<"InstagramPost"> | string
    artistId?: StringFilter<"InstagramPost"> | string
    instagramPostId?: StringNullableFilter<"InstagramPost"> | string | null
    caption?: StringNullableFilter<"InstagramPost"> | string | null
    imageUrl?: StringNullableFilter<"InstagramPost"> | string | null
    postedAt?: DateTimeNullableFilter<"InstagramPost"> | Date | string | null
    url?: StringNullableFilter<"InstagramPost"> | string | null
    createdAt?: DateTimeFilter<"InstagramPost"> | Date | string
  }

  export type ProjectUpsertWithWhereUniqueWithoutArtistInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutArtistInput, ProjectUncheckedUpdateWithoutArtistInput>
    create: XOR<ProjectCreateWithoutArtistInput, ProjectUncheckedCreateWithoutArtistInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutArtistInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutArtistInput, ProjectUncheckedUpdateWithoutArtistInput>
  }

  export type ProjectUpdateManyWithWhereWithoutArtistInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutArtistInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    artistId?: StringFilter<"Project"> | string
    title?: StringNullableFilter<"Project"> | string | null
    portalToken?: StringFilter<"Project"> | string
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    rating?: IntNullableFilter<"Project"> | number | null
    review?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type ContactInfoUpsertWithWhereUniqueWithoutArtistInput = {
    where: ContactInfoWhereUniqueInput
    update: XOR<ContactInfoUpdateWithoutArtistInput, ContactInfoUncheckedUpdateWithoutArtistInput>
    create: XOR<ContactInfoCreateWithoutArtistInput, ContactInfoUncheckedCreateWithoutArtistInput>
  }

  export type ContactInfoUpdateWithWhereUniqueWithoutArtistInput = {
    where: ContactInfoWhereUniqueInput
    data: XOR<ContactInfoUpdateWithoutArtistInput, ContactInfoUncheckedUpdateWithoutArtistInput>
  }

  export type ContactInfoUpdateManyWithWhereWithoutArtistInput = {
    where: ContactInfoScalarWhereInput
    data: XOR<ContactInfoUpdateManyMutationInput, ContactInfoUncheckedUpdateManyWithoutArtistInput>
  }

  export type ContactInfoScalarWhereInput = {
    AND?: ContactInfoScalarWhereInput | ContactInfoScalarWhereInput[]
    OR?: ContactInfoScalarWhereInput[]
    NOT?: ContactInfoScalarWhereInput | ContactInfoScalarWhereInput[]
    id?: StringFilter<"ContactInfo"> | string
    artistId?: StringFilter<"ContactInfo"> | string
    email?: StringFilter<"ContactInfo"> | string
    confidence?: StringFilter<"ContactInfo"> | string
    score?: IntFilter<"ContactInfo"> | number
    sourceUrl?: StringNullableFilter<"ContactInfo"> | string | null
    sourceType?: StringNullableFilter<"ContactInfo"> | string | null
    discoveredAt?: DateTimeFilter<"ContactInfo"> | Date | string
  }

  export type MergeProposalUpsertWithWhereUniqueWithoutPrimaryArtistInput = {
    where: MergeProposalWhereUniqueInput
    update: XOR<MergeProposalUpdateWithoutPrimaryArtistInput, MergeProposalUncheckedUpdateWithoutPrimaryArtistInput>
    create: XOR<MergeProposalCreateWithoutPrimaryArtistInput, MergeProposalUncheckedCreateWithoutPrimaryArtistInput>
  }

  export type MergeProposalUpdateWithWhereUniqueWithoutPrimaryArtistInput = {
    where: MergeProposalWhereUniqueInput
    data: XOR<MergeProposalUpdateWithoutPrimaryArtistInput, MergeProposalUncheckedUpdateWithoutPrimaryArtistInput>
  }

  export type MergeProposalUpdateManyWithWhereWithoutPrimaryArtistInput = {
    where: MergeProposalScalarWhereInput
    data: XOR<MergeProposalUpdateManyMutationInput, MergeProposalUncheckedUpdateManyWithoutPrimaryArtistInput>
  }

  export type MergeProposalScalarWhereInput = {
    AND?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
    OR?: MergeProposalScalarWhereInput[]
    NOT?: MergeProposalScalarWhereInput | MergeProposalScalarWhereInput[]
    id?: StringFilter<"MergeProposal"> | string
    primaryArtistId?: StringFilter<"MergeProposal"> | string
    duplicateArtistId?: StringFilter<"MergeProposal"> | string
    primaryName?: StringFilter<"MergeProposal"> | string
    duplicateName?: StringFilter<"MergeProposal"> | string
    similarityScore?: FloatFilter<"MergeProposal"> | number
    confidence?: StringFilter<"MergeProposal"> | string
    reason?: StringFilter<"MergeProposal"> | string
    status?: StringFilter<"MergeProposal"> | string
    createdAt?: DateTimeFilter<"MergeProposal"> | Date | string
  }

  export type MergeProposalUpsertWithWhereUniqueWithoutDuplicateArtistInput = {
    where: MergeProposalWhereUniqueInput
    update: XOR<MergeProposalUpdateWithoutDuplicateArtistInput, MergeProposalUncheckedUpdateWithoutDuplicateArtistInput>
    create: XOR<MergeProposalCreateWithoutDuplicateArtistInput, MergeProposalUncheckedCreateWithoutDuplicateArtistInput>
  }

  export type MergeProposalUpdateWithWhereUniqueWithoutDuplicateArtistInput = {
    where: MergeProposalWhereUniqueInput
    data: XOR<MergeProposalUpdateWithoutDuplicateArtistInput, MergeProposalUncheckedUpdateWithoutDuplicateArtistInput>
  }

  export type MergeProposalUpdateManyWithWhereWithoutDuplicateArtistInput = {
    where: MergeProposalScalarWhereInput
    data: XOR<MergeProposalUpdateManyMutationInput, MergeProposalUncheckedUpdateManyWithoutDuplicateArtistInput>
  }

  export type ArtistCreateWithoutLeadsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutLeadsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutLeadsInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutLeadsInput, ArtistUncheckedCreateWithoutLeadsInput>
  }

  export type MessageDraftCreateWithoutLeadInput = {
    id?: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
  }

  export type MessageDraftUncheckedCreateWithoutLeadInput = {
    id?: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
  }

  export type MessageDraftCreateOrConnectWithoutLeadInput = {
    where: MessageDraftWhereUniqueInput
    create: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput>
  }

  export type MessageDraftCreateManyLeadInputEnvelope = {
    data: MessageDraftCreateManyLeadInput | MessageDraftCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type ActivityCreateWithoutLeadInput = {
    id?: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
  }

  export type ActivityUncheckedCreateWithoutLeadInput = {
    id?: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
  }

  export type ActivityCreateOrConnectWithoutLeadInput = {
    where: ActivityWhereUniqueInput
    create: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput>
  }

  export type ActivityCreateManyLeadInputEnvelope = {
    data: ActivityCreateManyLeadInput | ActivityCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type ArtistUpsertWithoutLeadsInput = {
    update: XOR<ArtistUpdateWithoutLeadsInput, ArtistUncheckedUpdateWithoutLeadsInput>
    create: XOR<ArtistCreateWithoutLeadsInput, ArtistUncheckedCreateWithoutLeadsInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutLeadsInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutLeadsInput, ArtistUncheckedUpdateWithoutLeadsInput>
  }

  export type ArtistUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type MessageDraftUpsertWithWhereUniqueWithoutLeadInput = {
    where: MessageDraftWhereUniqueInput
    update: XOR<MessageDraftUpdateWithoutLeadInput, MessageDraftUncheckedUpdateWithoutLeadInput>
    create: XOR<MessageDraftCreateWithoutLeadInput, MessageDraftUncheckedCreateWithoutLeadInput>
  }

  export type MessageDraftUpdateWithWhereUniqueWithoutLeadInput = {
    where: MessageDraftWhereUniqueInput
    data: XOR<MessageDraftUpdateWithoutLeadInput, MessageDraftUncheckedUpdateWithoutLeadInput>
  }

  export type MessageDraftUpdateManyWithWhereWithoutLeadInput = {
    where: MessageDraftScalarWhereInput
    data: XOR<MessageDraftUpdateManyMutationInput, MessageDraftUncheckedUpdateManyWithoutLeadInput>
  }

  export type MessageDraftScalarWhereInput = {
    AND?: MessageDraftScalarWhereInput | MessageDraftScalarWhereInput[]
    OR?: MessageDraftScalarWhereInput[]
    NOT?: MessageDraftScalarWhereInput | MessageDraftScalarWhereInput[]
    id?: StringFilter<"MessageDraft"> | string
    leadId?: StringFilter<"MessageDraft"> | string
    tone?: StringNullableFilter<"MessageDraft"> | string | null
    body?: StringFilter<"MessageDraft"> | string
    source?: StringNullableFilter<"MessageDraft"> | string | null
    selected?: BoolFilter<"MessageDraft"> | boolean
    createdAt?: DateTimeFilter<"MessageDraft"> | Date | string
  }

  export type ActivityUpsertWithWhereUniqueWithoutLeadInput = {
    where: ActivityWhereUniqueInput
    update: XOR<ActivityUpdateWithoutLeadInput, ActivityUncheckedUpdateWithoutLeadInput>
    create: XOR<ActivityCreateWithoutLeadInput, ActivityUncheckedCreateWithoutLeadInput>
  }

  export type ActivityUpdateWithWhereUniqueWithoutLeadInput = {
    where: ActivityWhereUniqueInput
    data: XOR<ActivityUpdateWithoutLeadInput, ActivityUncheckedUpdateWithoutLeadInput>
  }

  export type ActivityUpdateManyWithWhereWithoutLeadInput = {
    where: ActivityScalarWhereInput
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyWithoutLeadInput>
  }

  export type ActivityScalarWhereInput = {
    AND?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
    OR?: ActivityScalarWhereInput[]
    NOT?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
    id?: StringFilter<"Activity"> | string
    leadId?: StringFilter<"Activity"> | string
    type?: EnumActivityTypeFilter<"Activity"> | $Enums.ActivityType
    note?: StringNullableFilter<"Activity"> | string | null
    occurredAt?: DateTimeFilter<"Activity"> | Date | string
    createdAt?: DateTimeFilter<"Activity"> | Date | string
  }

  export type ArtistCreateWithoutReleasesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutReleasesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutReleasesInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutReleasesInput, ArtistUncheckedCreateWithoutReleasesInput>
  }

  export type ArtistUpsertWithoutReleasesInput = {
    update: XOR<ArtistUpdateWithoutReleasesInput, ArtistUncheckedUpdateWithoutReleasesInput>
    create: XOR<ArtistCreateWithoutReleasesInput, ArtistUncheckedCreateWithoutReleasesInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutReleasesInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutReleasesInput, ArtistUncheckedUpdateWithoutReleasesInput>
  }

  export type ArtistUpdateWithoutReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistCreateWithoutInstagramPostsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutInstagramPostsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutInstagramPostsInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutInstagramPostsInput, ArtistUncheckedCreateWithoutInstagramPostsInput>
  }

  export type ArtistUpsertWithoutInstagramPostsInput = {
    update: XOR<ArtistUpdateWithoutInstagramPostsInput, ArtistUncheckedUpdateWithoutInstagramPostsInput>
    create: XOR<ArtistCreateWithoutInstagramPostsInput, ArtistUncheckedCreateWithoutInstagramPostsInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutInstagramPostsInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutInstagramPostsInput, ArtistUncheckedUpdateWithoutInstagramPostsInput>
  }

  export type ArtistUpdateWithoutInstagramPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutInstagramPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type LeadCreateWithoutMessagesInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutLeadsInput
    activities?: ActivityCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutMessagesInput = {
    id?: string
    artistId: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ActivityUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutMessagesInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
  }

  export type LeadUpsertWithoutMessagesInput = {
    update: XOR<LeadUpdateWithoutMessagesInput, LeadUncheckedUpdateWithoutMessagesInput>
    create: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutMessagesInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutMessagesInput, LeadUncheckedUpdateWithoutMessagesInput>
  }

  export type LeadUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutLeadsNestedInput
    activities?: ActivityUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ActivityUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateWithoutActivitiesInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutLeadsInput
    messages?: MessageDraftCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutActivitiesInput = {
    id?: string
    artistId: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageDraftUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutActivitiesInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutActivitiesInput, LeadUncheckedCreateWithoutActivitiesInput>
  }

  export type LeadUpsertWithoutActivitiesInput = {
    update: XOR<LeadUpdateWithoutActivitiesInput, LeadUncheckedUpdateWithoutActivitiesInput>
    create: XOR<LeadCreateWithoutActivitiesInput, LeadUncheckedCreateWithoutActivitiesInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutActivitiesInput, LeadUncheckedUpdateWithoutActivitiesInput>
  }

  export type LeadUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutLeadsNestedInput
    messages?: MessageDraftUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageDraftUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type ArtistCreateWithoutProjectsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutProjectsInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutProjectsInput, ArtistUncheckedCreateWithoutProjectsInput>
  }

  export type ProjectFileCreateWithoutProjectInput = {
    id?: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutFileInput
  }

  export type ProjectFileCreateOrConnectWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileCreateManyProjectInputEnvelope = {
    data: ProjectFileCreateManyProjectInput | ProjectFileCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectFeedbackCreateWithoutProjectInput = {
    id?: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    timestamp?: number | null
    file?: ProjectFileCreateNestedOneWithoutFeedbacksInput
  }

  export type ProjectFeedbackUncheckedCreateWithoutProjectInput = {
    id?: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    fileId?: string | null
    timestamp?: number | null
  }

  export type ProjectFeedbackCreateOrConnectWithoutProjectInput = {
    where: ProjectFeedbackWhereUniqueInput
    create: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFeedbackCreateManyProjectInputEnvelope = {
    data: ProjectFeedbackCreateManyProjectInput | ProjectFeedbackCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectInvoiceCreateWithoutProjectInput = {
    id?: string
    invoiceNumber: string
    issuedAt?: Date | string
    dueAt?: Date | string | null
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    subtotalCents: number
    taxCents?: number
    totalCents: number
    notes?: string | null
    stripePaymentUrl?: string | null
    paidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectInvoiceUncheckedCreateWithoutProjectInput = {
    id?: string
    invoiceNumber: string
    issuedAt?: Date | string
    dueAt?: Date | string | null
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    subtotalCents: number
    taxCents?: number
    totalCents: number
    notes?: string | null
    stripePaymentUrl?: string | null
    paidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectInvoiceCreateOrConnectWithoutProjectInput = {
    where: ProjectInvoiceWhereUniqueInput
    create: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
  }

  export type ArtistUpsertWithoutProjectsInput = {
    update: XOR<ArtistUpdateWithoutProjectsInput, ArtistUncheckedUpdateWithoutProjectsInput>
    create: XOR<ArtistCreateWithoutProjectsInput, ArtistUncheckedCreateWithoutProjectsInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutProjectsInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutProjectsInput, ArtistUncheckedUpdateWithoutProjectsInput>
  }

  export type ArtistUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    url?: StringFilter<"ProjectFile"> | string
    key?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    isPublic?: BoolFilter<"ProjectFile"> | boolean
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
  }

  export type ProjectFeedbackUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFeedbackWhereUniqueInput
    update: XOR<ProjectFeedbackUpdateWithoutProjectInput, ProjectFeedbackUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFeedbackCreateWithoutProjectInput, ProjectFeedbackUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFeedbackUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFeedbackWhereUniqueInput
    data: XOR<ProjectFeedbackUpdateWithoutProjectInput, ProjectFeedbackUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFeedbackUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFeedbackScalarWhereInput
    data: XOR<ProjectFeedbackUpdateManyMutationInput, ProjectFeedbackUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFeedbackScalarWhereInput = {
    AND?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
    OR?: ProjectFeedbackScalarWhereInput[]
    NOT?: ProjectFeedbackScalarWhereInput | ProjectFeedbackScalarWhereInput[]
    id?: StringFilter<"ProjectFeedback"> | string
    projectId?: StringFilter<"ProjectFeedback"> | string
    content?: StringFilter<"ProjectFeedback"> | string
    resolved?: BoolFilter<"ProjectFeedback"> | boolean
    createdAt?: DateTimeFilter<"ProjectFeedback"> | Date | string
    fileId?: StringNullableFilter<"ProjectFeedback"> | string | null
    timestamp?: FloatNullableFilter<"ProjectFeedback"> | number | null
  }

  export type ProjectInvoiceUpsertWithoutProjectInput = {
    update: XOR<ProjectInvoiceUpdateWithoutProjectInput, ProjectInvoiceUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectInvoiceCreateWithoutProjectInput, ProjectInvoiceUncheckedCreateWithoutProjectInput>
    where?: ProjectInvoiceWhereInput
  }

  export type ProjectInvoiceUpdateToOneWithWhereWithoutProjectInput = {
    where?: ProjectInvoiceWhereInput
    data: XOR<ProjectInvoiceUpdateWithoutProjectInput, ProjectInvoiceUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectInvoiceUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectInvoiceUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    subtotalCents?: IntFieldUpdateOperationsInput | number
    taxCents?: IntFieldUpdateOperationsInput | number
    totalCents?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutProjectsInput
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    artistId: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type ProjectFeedbackCreateWithoutFileInput = {
    id?: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    timestamp?: number | null
    project: ProjectCreateNestedOneWithoutFeedbacksInput
  }

  export type ProjectFeedbackUncheckedCreateWithoutFileInput = {
    id?: string
    projectId: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    timestamp?: number | null
  }

  export type ProjectFeedbackCreateOrConnectWithoutFileInput = {
    where: ProjectFeedbackWhereUniqueInput
    create: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput>
  }

  export type ProjectFeedbackCreateManyFileInputEnvelope = {
    data: ProjectFeedbackCreateManyFileInput | ProjectFeedbackCreateManyFileInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutProjectsNestedInput
    feedbacks?: ProjectFeedbackUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectFeedbackUpsertWithWhereUniqueWithoutFileInput = {
    where: ProjectFeedbackWhereUniqueInput
    update: XOR<ProjectFeedbackUpdateWithoutFileInput, ProjectFeedbackUncheckedUpdateWithoutFileInput>
    create: XOR<ProjectFeedbackCreateWithoutFileInput, ProjectFeedbackUncheckedCreateWithoutFileInput>
  }

  export type ProjectFeedbackUpdateWithWhereUniqueWithoutFileInput = {
    where: ProjectFeedbackWhereUniqueInput
    data: XOR<ProjectFeedbackUpdateWithoutFileInput, ProjectFeedbackUncheckedUpdateWithoutFileInput>
  }

  export type ProjectFeedbackUpdateManyWithWhereWithoutFileInput = {
    where: ProjectFeedbackScalarWhereInput
    data: XOR<ProjectFeedbackUpdateManyMutationInput, ProjectFeedbackUncheckedUpdateManyWithoutFileInput>
  }

  export type ProjectCreateWithoutFeedbacksInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFeedbacksInput = {
    id?: string
    artistId: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    invoice?: ProjectInvoiceUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFeedbacksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFeedbacksInput, ProjectUncheckedCreateWithoutFeedbacksInput>
  }

  export type ProjectFileCreateWithoutFeedbacksInput = {
    id?: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
  }

  export type ProjectFileUncheckedCreateWithoutFeedbacksInput = {
    id?: string
    projectId: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutFeedbacksInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutFeedbacksInput, ProjectFileUncheckedCreateWithoutFeedbacksInput>
  }

  export type ProjectUpsertWithoutFeedbacksInput = {
    update: XOR<ProjectUpdateWithoutFeedbacksInput, ProjectUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<ProjectCreateWithoutFeedbacksInput, ProjectUncheckedCreateWithoutFeedbacksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFeedbacksInput, ProjectUncheckedUpdateWithoutFeedbacksInput>
  }

  export type ProjectUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectFileUpsertWithoutFeedbacksInput = {
    update: XOR<ProjectFileUpdateWithoutFeedbacksInput, ProjectFileUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<ProjectFileCreateWithoutFeedbacksInput, ProjectFileUncheckedCreateWithoutFeedbacksInput>
    where?: ProjectFileWhereInput
  }

  export type ProjectFileUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: ProjectFileWhereInput
    data: XOR<ProjectFileUpdateWithoutFeedbacksInput, ProjectFileUncheckedUpdateWithoutFeedbacksInput>
  }

  export type ProjectFileUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateWithoutInvoiceInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    artist: ArtistCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutInvoiceInput = {
    id?: string
    artistId: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    feedbacks?: ProjectFeedbackUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutInvoiceInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutInvoiceInput, ProjectUncheckedCreateWithoutInvoiceInput>
  }

  export type ProjectUpsertWithoutInvoiceInput = {
    update: XOR<ProjectUpdateWithoutInvoiceInput, ProjectUncheckedUpdateWithoutInvoiceInput>
    create: XOR<ProjectCreateWithoutInvoiceInput, ProjectUncheckedCreateWithoutInvoiceInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutInvoiceInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutInvoiceInput, ProjectUncheckedUpdateWithoutInvoiceInput>
  }

  export type ProjectUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artist?: ArtistUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    artistId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ArtistCreateWithoutContactInfosInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutContactInfosInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutContactInfosInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutContactInfosInput, ArtistUncheckedCreateWithoutContactInfosInput>
  }

  export type ArtistUpsertWithoutContactInfosInput = {
    update: XOR<ArtistUpdateWithoutContactInfosInput, ArtistUncheckedUpdateWithoutContactInfosInput>
    create: XOR<ArtistCreateWithoutContactInfosInput, ArtistUncheckedCreateWithoutContactInfosInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutContactInfosInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutContactInfosInput, ArtistUncheckedUpdateWithoutContactInfosInput>
  }

  export type ArtistUpdateWithoutContactInfosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutContactInfosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistCreateWithoutPrimaryMergesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    duplicateMerges?: MergeProposalCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistUncheckedCreateWithoutPrimaryMergesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    duplicateMerges?: MergeProposalUncheckedCreateNestedManyWithoutDuplicateArtistInput
  }

  export type ArtistCreateOrConnectWithoutPrimaryMergesInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutPrimaryMergesInput, ArtistUncheckedCreateWithoutPrimaryMergesInput>
  }

  export type ArtistCreateWithoutDuplicateMergesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutArtistInput
    releases?: ReleaseCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostCreateNestedManyWithoutArtistInput
    projects?: ProjectCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalCreateNestedManyWithoutPrimaryArtistInput
  }

  export type ArtistUncheckedCreateWithoutDuplicateMergesInput = {
    id?: string
    name: string
    instagramHandle?: string | null
    instagramProfileUrl?: string | null
    instagramProfileImageUrl?: string | null
    spotifyArtistId?: string | null
    spotifyArtistUrl?: string | null
    spotifyImageUrl?: string | null
    spotifyAccent?: string | null
    spotifyAccentStrong?: string | null
    spotifyHighlight?: string | null
    officialSiteUrl?: string | null
    location?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    genre?: string | null
    tags?: ArtistCreatetagsInput | string[]
    bio?: string | null
    emails?: ArtistCreateemailsInput | string[]
    followerCount?: number | null
    lastPostAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutArtistInput
    releases?: ReleaseUncheckedCreateNestedManyWithoutArtistInput
    instagramPosts?: InstagramPostUncheckedCreateNestedManyWithoutArtistInput
    projects?: ProjectUncheckedCreateNestedManyWithoutArtistInput
    contactInfos?: ContactInfoUncheckedCreateNestedManyWithoutArtistInput
    primaryMerges?: MergeProposalUncheckedCreateNestedManyWithoutPrimaryArtistInput
  }

  export type ArtistCreateOrConnectWithoutDuplicateMergesInput = {
    where: ArtistWhereUniqueInput
    create: XOR<ArtistCreateWithoutDuplicateMergesInput, ArtistUncheckedCreateWithoutDuplicateMergesInput>
  }

  export type ArtistUpsertWithoutPrimaryMergesInput = {
    update: XOR<ArtistUpdateWithoutPrimaryMergesInput, ArtistUncheckedUpdateWithoutPrimaryMergesInput>
    create: XOR<ArtistCreateWithoutPrimaryMergesInput, ArtistUncheckedCreateWithoutPrimaryMergesInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutPrimaryMergesInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutPrimaryMergesInput, ArtistUncheckedUpdateWithoutPrimaryMergesInput>
  }

  export type ArtistUpdateWithoutPrimaryMergesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    duplicateMerges?: MergeProposalUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutPrimaryMergesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    duplicateMerges?: MergeProposalUncheckedUpdateManyWithoutDuplicateArtistNestedInput
  }

  export type ArtistUpsertWithoutDuplicateMergesInput = {
    update: XOR<ArtistUpdateWithoutDuplicateMergesInput, ArtistUncheckedUpdateWithoutDuplicateMergesInput>
    create: XOR<ArtistCreateWithoutDuplicateMergesInput, ArtistUncheckedCreateWithoutDuplicateMergesInput>
    where?: ArtistWhereInput
  }

  export type ArtistUpdateToOneWithWhereWithoutDuplicateMergesInput = {
    where?: ArtistWhereInput
    data: XOR<ArtistUpdateWithoutDuplicateMergesInput, ArtistUncheckedUpdateWithoutDuplicateMergesInput>
  }

  export type ArtistUpdateWithoutDuplicateMergesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUpdateManyWithoutArtistNestedInput
    projects?: ProjectUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUpdateManyWithoutPrimaryArtistNestedInput
  }

  export type ArtistUncheckedUpdateWithoutDuplicateMergesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    instagramHandle?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    instagramProfileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyArtistUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccent?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyAccentStrong?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyHighlight?: NullableStringFieldUpdateOperationsInput | string | null
    officialSiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    genre?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArtistUpdatetagsInput | string[]
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    emails?: ArtistUpdateemailsInput | string[]
    followerCount?: NullableIntFieldUpdateOperationsInput | number | null
    lastPostAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutArtistNestedInput
    releases?: ReleaseUncheckedUpdateManyWithoutArtistNestedInput
    instagramPosts?: InstagramPostUncheckedUpdateManyWithoutArtistNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutArtistNestedInput
    contactInfos?: ContactInfoUncheckedUpdateManyWithoutArtistNestedInput
    primaryMerges?: MergeProposalUncheckedUpdateManyWithoutPrimaryArtistNestedInput
  }

  export type LeadCreateManyArtistInput = {
    id?: string
    status?: $Enums.LeadStatus
    score?: number | null
    scoreRationale?: string | null
    lastContactedAt?: Date | string | null
    nextActionAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReleaseCreateManyArtistInput = {
    id?: string
    spotifyTrackId?: string | null
    spotifyReleaseId?: string | null
    title: string
    releaseDate?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    releaseType?: string | null
    createdAt?: Date | string
  }

  export type InstagramPostCreateManyArtistInput = {
    id?: string
    instagramPostId?: string | null
    caption?: string | null
    imageUrl?: string | null
    postedAt?: Date | string | null
    url?: string | null
    createdAt?: Date | string
  }

  export type ProjectCreateManyArtistInput = {
    id?: string
    title?: string | null
    portalToken?: string
    status?: $Enums.ProjectStatus
    rating?: number | null
    review?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactInfoCreateManyArtistInput = {
    id?: string
    email: string
    confidence?: string
    score?: number
    sourceUrl?: string | null
    sourceType?: string | null
    discoveredAt?: Date | string
  }

  export type MergeProposalCreateManyPrimaryArtistInput = {
    id?: string
    duplicateArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type MergeProposalCreateManyDuplicateArtistInput = {
    id?: string
    primaryArtistId: string
    primaryName: string
    duplicateName: string
    similarityScore: number
    confidence: string
    reason: string
    status?: string
    createdAt?: Date | string
  }

  export type LeadUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageDraftUpdateManyWithoutLeadNestedInput
    activities?: ActivityUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageDraftUncheckedUpdateManyWithoutLeadNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateManyWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    scoreRationale?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextActionAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseUncheckedUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReleaseUncheckedUpdateManyWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    spotifyTrackId?: NullableStringFieldUpdateOperationsInput | string | null
    spotifyReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    releaseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    releaseType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostUncheckedUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstagramPostUncheckedUpdateManyWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    instagramPostId?: NullableStringFieldUpdateOperationsInput | string | null
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutProjectNestedInput
    invoice?: ProjectInvoiceUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    portalToken?: StringFieldUpdateOperationsInput | string
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    rating?: NullableIntFieldUpdateOperationsInput | number | null
    review?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoUncheckedUpdateWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoUncheckedUpdateManyWithoutArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalUpdateWithoutPrimaryArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duplicateArtist?: ArtistUpdateOneRequiredWithoutDuplicateMergesNestedInput
  }

  export type MergeProposalUncheckedUpdateWithoutPrimaryArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    duplicateArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalUncheckedUpdateManyWithoutPrimaryArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    duplicateArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalUpdateWithoutDuplicateArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryArtist?: ArtistUpdateOneRequiredWithoutPrimaryMergesNestedInput
  }

  export type MergeProposalUncheckedUpdateWithoutDuplicateArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MergeProposalUncheckedUpdateManyWithoutDuplicateArtistInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryArtistId?: StringFieldUpdateOperationsInput | string
    primaryName?: StringFieldUpdateOperationsInput | string
    duplicateName?: StringFieldUpdateOperationsInput | string
    similarityScore?: FloatFieldUpdateOperationsInput | number
    confidence?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftCreateManyLeadInput = {
    id?: string
    tone?: string | null
    body: string
    source?: string | null
    selected?: boolean
    createdAt?: Date | string
  }

  export type ActivityCreateManyLeadInput = {
    id?: string
    type: $Enums.ActivityType
    note?: string | null
    occurredAt?: Date | string
    createdAt?: Date | string
  }

  export type MessageDraftUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageDraftUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    tone?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    selected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType
    note?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateManyProjectInput = {
    id?: string
    name: string
    url: string
    key: string
    size: number
    mimeType: string
    type?: $Enums.FileType
    isPublic?: boolean
    createdAt?: Date | string
  }

  export type ProjectFeedbackCreateManyProjectInput = {
    id?: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    fileId?: string | null
    timestamp?: number | null
  }

  export type ProjectFileUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: ProjectFeedbackUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: ProjectFeedbackUncheckedUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFeedbackUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    file?: ProjectFileUpdateOneWithoutFeedbacksNestedInput
  }

  export type ProjectFeedbackUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectFeedbackUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectFeedbackCreateManyFileInput = {
    id?: string
    projectId: string
    content: string
    resolved?: boolean
    createdAt?: Date | string
    timestamp?: number | null
  }

  export type ProjectFeedbackUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    project?: ProjectUpdateOneRequiredWithoutFeedbacksNestedInput
  }

  export type ProjectFeedbackUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProjectFeedbackUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    resolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}