# ✅ DEPLOYMENT CHECKLIST

## Pre-Deployment

### 1. Database Migration
- [ ] Copy nội dung từ `docs/supabase_shape_migration.sql`
- [ ] Mở Supabase Dashboard → SQL Editor
- [ ] Paste và Execute migration
- [ ] Verify với query:
  ```sql
  SELECT column_name, data_type, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'nodes' AND column_name = 'shape';
  ```
- [ ] Expected result: `shape | character varying | 'RECTANGLE'`

### 2. Environment Check
- [ ] Node.js: v16+ installed
- [ ] Dependencies: `npm install` completed
- [ ] Supabase credentials trong `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  ```

### 3. Build Test
- [ ] Run: `npm run build`
- [ ] Check for errors (TypeScript compile)
- [ ] Expected: "✓ Compiled successfully"

---

## Testing

### 4. Dev Server Test
- [ ] Start: `npm run dev`
- [ ] Open: `http://localhost:3000/shapes-demo`
- [ ] Verify: All 10 shapes render
- [ ] Verify: Interactive preview works
- [ ] Verify: Shape selector UI functional

### 5. Editor Test
- [ ] Navigate to existing mindmap: `/mindmaps/[id]`
- [ ] Click "Add Node" → New node appears
- [ ] Click node → Edit dialog opens
- [ ] Change shape → Save
- [ ] Verify: Node shape updated visually
- [ ] Verify: Console shows no errors

### 6. Realtime Sync Test
- [ ] Open mindmap in 2 browser tabs (different browsers hoặc incognito)
- [ ] Tab 1: Change node shape to STAR
- [ ] Tab 2: Verify node instantly becomes STAR ⚡
- [ ] Tab 2: Change same node to CLOUD
- [ ] Tab 1: Verify node instantly becomes CLOUD ⚡
- [ ] Expected: < 500ms sync latency

### 7. Visual Effects Test
- [ ] Hover over nodes → Scale + Glow increase
- [ ] Click node → Selected state with pulse animation
- [ ] Test all 10 shapes
- [ ] Drag node → Smooth movement
- [ ] Connect nodes → Edges work normally

### 8. Performance Test
- [ ] Create 20+ nodes với different shapes
- [ ] Drag nodes around
- [ ] Check: No lag, smooth 60fps
- [ ] Check: CPU usage < 30%
- [ ] Check: Memory stable

### 9. Mobile Test (Optional)
- [ ] Open on mobile device
- [ ] Verify: Responsive layout
- [ ] Verify: Touch drag works
- [ ] Verify: Shape selector scrollable

---

## Database Verification

### 10. Supabase Data Check
Run in Supabase SQL Editor:

```sql
-- Check existing nodes have shape
SELECT node_id, content, shape, color 
FROM nodes 
LIMIT 5;

-- Count nodes by shape
SELECT shape, COUNT(*) as count
FROM nodes
GROUP BY shape
ORDER BY count DESC;

-- Check constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'valid_node_shape';
```

Expected:
- [x] All nodes have `shape` field
- [x] Default shape is 'RECTANGLE'
- [x] Constraint exists with 10 valid values

---

## Documentation Review

### 11. Files Existence Check
- [ ] `components/custom-node.tsx` exists
- [ ] `components/shape-selector.tsx` exists
- [ ] `hooks/use-update-node-shape.ts` exists
- [ ] `app/node-shapes.css` exists
- [ ] `app/shapes-demo/page.tsx` exists
- [ ] `docs/NODE_SHAPES_GUIDE.md` exists
- [ ] `docs/SHAPE_SYSTEM_README.md` exists
- [ ] `docs/IMPLEMENTATION_SUMMARY.md` exists
- [ ] `docs/supabase_shape_migration.sql` exists

### 12. Code Quality Check
- [ ] No TypeScript errors in production code
- [ ] No console errors in browser
- [ ] CSS loaded correctly (check DevTools Network)
- [ ] Supabase realtime channel active (check Network WebSocket)

---

## Production Deployment

### 13. Build for Production
```bash
npm run build
npm run start
```
- [ ] Build successful
- [ ] Start on port 3000
- [ ] Test all features in production mode

### 14. Deploy to Hosting
Choose your platform:

#### Vercel (Recommended)
```bash
vercel --prod
```
- [ ] Deploy successful
- [ ] Test live URL
- [ ] Verify Supabase connection works

#### Other Platforms
```bash
# Build
npm run build

# Upload .next/ folder to hosting
# Configure start script: npm run start
```

### 15. Post-Deployment Verification
- [ ] Live URL loads
- [ ] Shapes render correctly
- [ ] Realtime sync works across devices
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse > 80)

---

## Rollback Plan (If Needed)

### 16. Rollback Steps
If something goes wrong:

1. **Database Rollback**:
   ```sql
   -- Remove shape column
   ALTER TABLE nodes DROP COLUMN IF EXISTS shape;
   
   -- Remove constraint
   DROP INDEX IF EXISTS idx_nodes_shape;
   ```

2. **Code Rollback**:
   ```bash
   git revert HEAD
   npm run build
   npm run start
   ```

3. **Verify old version working**

---

## Success Criteria

### ✅ Deployment Successful If:
- [x] All 10 shapes render correctly
- [x] Shape selector UI works
- [x] Supabase updates persist
- [x] Realtime sync < 1s
- [x] No console errors
- [x] No TypeScript errors
- [x] Visual effects smooth
- [x] Performance acceptable
- [x] Mobile responsive
- [x] Documentation complete

---

## Support & Troubleshooting

### Common Issues

#### Issue 1: Shapes không hiển thị
**Solution:**
- Check `node-shapes.css` imported trong `mindmap-editor.tsx`
- Verify `nodeTypes` registered
- Check browser DevTools Console for errors

#### Issue 2: Realtime không sync
**Solution:**
- Verify Supabase realtime enabled: Dashboard → Settings → API
- Check RLS policies: Table `nodes` needs SELECT, UPDATE permissions
- Verify channel subscription in browser DevTools → Network → WS

#### Issue 3: Build errors
**Solution:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

#### Issue 4: Database migration failed
**Solution:**
- Check Supabase logs
- Verify table `nodes` exists
- Try migration line-by-line in SQL Editor

---

## Contacts

**Documentation**: See `docs/` folder
**Demo Page**: `/shapes-demo`
**Examples**: `docs/shape-examples.ts`

---

## Final Notes

🎉 **Congratulations!** If all checkboxes are checked, your cosmic mindmap với multi-shape node system đã deploy thành công!

**Next Steps:**
1. Share demo link với team
2. Gather user feedback
3. Monitor performance metrics
4. Plan Phase 2 features (nếu cần)

**Built with ❤️ using React Flow + Supabase + Tailwind CSS**

---

**Date Deployed:** _______________  
**Deployed By:** _______________  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
