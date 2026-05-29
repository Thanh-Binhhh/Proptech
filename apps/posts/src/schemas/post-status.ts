export enum PostStatus_Stage1 {
    DRAFT = 'Bản nháp',
    PENDING_APPROVAL = 'Chờ duyệt',
}

export enum PostStatus_Stage2 {
    REJECTED = 'Từ chối',
    PUBLISHED = 'Xuất bản',
}

export enum PostStatus_Stage3 {
    PUBLISHED = 'Xuất bản',
    PRIVATE = 'Riêng tư'
}

export const PostStatusValues = [
    ...Object.values(PostStatus_Stage1),
    ...Object.values(PostStatus_Stage2),
    ...Object.values(PostStatus_Stage3),
];