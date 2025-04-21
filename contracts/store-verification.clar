;; Store Verification Contract
;; Validates legitimate retail locations

(define-data-var admin principal tx-sender)

;; Map of verified store IDs to their information
(define-map verified-stores
  { store-id: (string-ascii 20) }
  {
    name: (string-ascii 50),
    location: (string-ascii 100),
    verified: bool
  }
)

;; Register a new store
(define-public (register-store (store-id (string-ascii 20)) (name (string-ascii 50)) (location (string-ascii 100)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? verified-stores { store-id: store-id })) (err u100))
    (ok (map-set verified-stores
      { store-id: store-id }
      {
        name: name,
        location: location,
        verified: false
      }
    ))
  )
)

;; Verify a store
(define-public (verify-store (store-id (string-ascii 20)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (match (map-get? verified-stores { store-id: store-id })
      store-data (ok (map-set verified-stores
                    { store-id: store-id }
                    (merge store-data { verified: true })))
      (err u404)
    )
  )
)

;; Check if a store is verified
(define-read-only (is-store-verified (store-id (string-ascii 20)))
  (match (map-get? verified-stores { store-id: store-id })
    store-data (ok (get verified store-data))
    (err u404)
  )
)

;; Transfer admin rights
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)
