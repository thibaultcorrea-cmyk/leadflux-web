export interface ISystemWriteRepository {
    truncate: () => Promise<void>
}
